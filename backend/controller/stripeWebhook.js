// const stripe = require("../config/stripe");
// const orderModel = require("../models/orderModel");
// const cartModel = require("../models/cartModel");

// const webhookSecretKey = process.env.STRIPE_WEBHOOK_SECRET_KEY;

// const cartProducts = async (cartProductsList) => {
//   let ProductsList = [];
//   if (cartProductsList?.data?.length) {
//     for (const cartProduct of cartProductsList.data) {
//       const product = await stripe.products.retrieve(cartProduct.price.product);
//       const productId = product.metadata.productId;
//       const productData = {
//         productId: productId,
//         name: product.name,
//         price: cartProduct.price.unit_amount / 100,
//         quantity: cartProduct.quantity,
//         photo: product.images,
//       };
//       ProductsList.push(productData);
//     }
//   }
//   return ProductsList;
// };

// const stripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, webhookSecretKey);
//   } catch (err) {
//     console.error(`Webhook signature verification failed: ${err.message}`);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   console.log('Received event:', event);

//   switch (event.type) {
//     case "checkout.session.completed":
//       try {
//         const session = event.data.object;
//         console.log('Session object:', session);

//         const cartProductsList = await stripe.checkout.sessions.listLineItems(session.id);
//         console.log('Cart products list:', cartProductsList);

//         const productDetails = await cartProducts(cartProductsList);
//         console.log('Product details:', productDetails);

//         // Parse and validate the shipping address
//         // let shippingAddress;
//         // try {
//           // shippingAddress = JSON.parse(session.metadata.shippingAddress);
//           // console.log('Parsed shipping address:', shippingAddress);
//         // } catch (parseError) {
//           // console.error(`Error parsing shipping address: ${parseError.message}`);
//           // return res.status(400).send(`Error parsing shipping address: ${parseError.message}`);
//         // }

//         const orderDetails = {
//           productDetails: productDetails,
//           email: session.customer_email,
//           userId: session.metadata.userId,
//           // shippingAddress: {
//           //   addressName: shippingAddress.name || "z",
//           //   phone: shippingAddress.phone || 9,
//           //   address: shippingAddress.address || "z",
//           //   pincode: shippingAddress.pincode || 9,
//           // },
//           // shippingAddressId: session.metadata.shippingAddressId,
//           paymentDetails: {
//             paymentId: session.payment_intent,
//             payment_method_type: session.payment_method_types,
//             payment_status: session.payment_status,
//           },
//           totalAmount: session.amount_total / 100,
//         };

//         console.log('Order details to save:', orderDetails);

//         const order = new orderModel(orderDetails);
//         const saveOrder = await order.save();
//         console.log('Saved order:', saveOrder);

//         if (saveOrder?._id) {
//           await cartModel.deleteMany({
//             userId: session.metadata.userId,
//           });
//           console.log(`Deleted cart for user: ${session.metadata.userId}`);
//         }

//         return res.status(200).send();
//       } catch (err) {
//         console.error(`Error handling event ${event.type}: ${err.message}`);
//         return res.status(400).send(`Error handling event: ${err.message}`);
//       }

//     default:
//       console.log(`Unhandled event type ${event.type}`);
//       return res.status(200).send();
//   }
// };

// module.exports = stripeWebhook;











// const stripe = require("../config/stripe");
// const orderModel = require("../models/orderModel");
// const cartModel = require("../models/cartModel");

// const webhookSecretKey = process.env.STRIPE_WEBHOOK_SECRET_KEY;

// const cartProducts = async (cartProductsList) => {
//   let ProductsList = [];
//   if (cartProductsList?.data?.length) {
//     for (const cartProduct of cartProductsList.data) {
//       const product = await stripe.products.retrieve(cartProduct.price.product);
//       const productId = product.metadata.productId;
//       const productData = {
//         productId: productId,
//         name: product.name,
//         price: cartProduct.price.unit_amount / 100,
//         quantity: cartProduct.quantity,
//         photo: product.images,
//       };
//       ProductsList.push(productData);
//     }
//   }
//   return ProductsList;
// };

// const stripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecretKey);
//   } catch (err) {
//     console.error(`Webhook signature verification failed: ${err.message}`);
//     res.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   console.log('Received event:', event);

//   switch (event.type) {
//     case "checkout.session.completed":
//       try {
//         const session = event.data.object;
//         const cartProductsList = await stripe.checkout.sessions.listLineItems(session.id);
//         const productDetails = await cartProducts(cartProductsList);

//         try {
//           const metadata = session.metadata;
        
//           // Create order model and save to database
//           const order = new orderModel({
//             productDetails: productDetails,
//             email: session.customer_email,
//             userId: session.metadata.userId,
//             // shippingAddress: {
//             //   name: metadata.shippingAddressName,
//             //   phone: metadata.shippingAddressPhone,
//             //   address: metadata.shippingAddressAddress,
//             //   pincode: metadata.shippingAddressPincode,
//             // },
//             paymentDetails: {
//               paymentId: session.payment_intent,
//               payment_method_type: session.payment_method_types,
//               payment_status: session.payment_status,
//             },
//             totalAmount: session.amount_total / 100,
//           });
        
//           const saveOrder = await order.save();
        
//           if (saveOrder) {
//             await cartModel.deleteMany({
//               userId: session.metadata.userId,
//             });
//           }
        
//           res.status(200).send();
//         } catch (error) {
//           console.error(`Error processing webhook event: ${error.message}`);
//           res.status(500).send(`Error processing webhook event: ${error.message}`);
//         }
//       } catch (err) {
//         console.error(`Error handling event ${event.type}: ${err.message}`);
//         res.status(400).send(`Error handling event: ${err.message}`);
//         return;
//       }
//       break;

//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.status(200).send();
// };

// module.exports = stripeWebhook;













const stripe = require("../config/stripe");
const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const addressModel = require("../models/addressModel");

const webhookSecretKey = process.env.STRIPE_WEBHOOK_SECRET_KEY;

const cartProducts = async (cartProductsList) => {
  let ProductsList = [];

  if (cartProductsList?.data?.length) {
    for (const cartProduct of cartProductsList.data) {
      const product = await stripe.products.retrieve(
        cartProduct.price.product
      );
      const productId = product.metadata.productId;

      const productData = {
        productId: productId,
        productName: product.name,
        price: cartProduct.price.unit_amount / 100,
        quantity: cartProduct.quantity,
        photo: product.images,
        size: product.metadata.size,
        color: product.metadata.color,
        status: "pending"
      };
      ProductsList.push(productData);
    }
  }

  return ProductsList;
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  const payloadString = JSON.stringify(req.body);

  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: webhookSecretKey,
  });

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payloadString,
      header,
      webhookSecretKey
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      const cartProductsList = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const productDetails = await cartProducts(cartProductsList);

      const shippingAddressId = session.metadata.shippingAddressId
      const shippingAddress = await addressModel.findOne({ _id: shippingAddressId });

      const orderDetails = {
        productDetails: productDetails,
        email: session.customer_email,
        userId: session.metadata.userId,
        paymentDetails: {
          paymentId: session.payment_intent,
          payment_method_type: session.payment_method_types,
          payment_status: session.payment_status,
        },
        shippingAddressId: session.metadata.shippingAddressId,
        shippingAddress: {
          addressId: shippingAddress._id,
          addressName: shippingAddress.name,
          addressPhone: shippingAddress.phone,
          address: shippingAddress.address,
          pincode: shippingAddress.pincode,
        },
        shipping_options: session.shipping_options.map((s) => {
          return {
            ...s,
            shipping_amount: s.shipping_amount / 100,
          };
        }),
        totalAmount: session.amount_total / 100,
      };

      const order = new orderModel(orderDetails);
      const saveOrder = await order.save();


      if (saveOrder?._id) {
        const deleteCartProduct = await cartModel.deleteMany({
          userId: session.metadata.userId,
        });
      }
      break;

    // ... handle other event types
    default:
      // console.log(Unhandled event type ${event.type});
  }

  res.status(200).send();
};

module.exports = stripeWebhook;