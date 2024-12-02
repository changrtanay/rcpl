// const stripe = require("../config/stripe");
// const userModel = require("../models/userModel");

// const paymentController = async (req, res) => {
//   try {
//     const { cartProducts, 
//       // shippingAddress 
//     } 
//       = req.body;

//     const user = await userModel.findOne({ _id: req.userId });

//     const params = {
//       submit_type: "pay",
//       mode: "payment",
//       payment_method_types: ["card"],
//       billing_address_collection: "auto",
//       // shipping_options: [
//       //   {
//       //     shipping_rate: "your_shipping_rate_id", // replace with your actual shipping rate ID
//       //   }, 
//       // ],
//       customer_email: user.email,
//       metadata: {
//         userId: req.userId,
//         // shippingAddressName: shippingAddress.name || "",
//         // shippingAddressPhone: shippingAddress.phone || "",
//         // shippingAddressAddress: shippingAddress.address || "",
//         // shippingAddressPincode: shippingAddress.pincode || "",
//       },
//       line_items: cartProducts.map((e) => {
//         return {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: e.productId.productName,
//               images: [e.productId.productPhoto[0]], // images instead of photo
//               metadata: {
//                 productId: e.productId._id,
//               },
//             },
//             unit_amount: e.productId.sellingPrice * 100,
//           },
//           adjustable_quantity: {
//             enabled: true,
//             minimum: 1,
//           },
//           quantity: e.quantity,
//         };
//       }),
//       success_url: `${process.env.FRONTEND_URL}/payment-success`,
//       cancel_url: `${process.env.FRONTEND_URL}/payment-fail`,
//     };

//     const session = await stripe.checkout.sessions.create(params);

//     res.status(303).json(session);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//       error: true,
//       success: false,
//     });
//   }
// };

// module.exports = paymentController;












// const stripe = require("../config/stripe");
// const userModel = require("../models/userModel");

// const paymentController = async (req, res) => {
//   try {
//     const { cartProducts } = req.body;

//     const user = await userModel.findOne({ _id: req.userId });

//     const params = {
//       submit_type: "pay",
//       mode: "payment",
//       payment_method_types: ["card"],
//       billing_address_collection: "auto",
//       // shipping_options: [
//       //   {
//       //     shipping_rate: "your_shipping_rate_id", // replace with your actual shipping rate ID
//       //   }, 
//       // ],
//       customer_email: user.email,
//       metadata: {
//         userId: req.userId,
//       },
//       line_items: cartProducts.map((e) => {
//         return {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: e.productId.productName,
//               images: [e.productId.productPhoto[0]], // images instead of photo
//               metadata: {
//                 productId: e.productId._id,
//               },
//             },
//             unit_amount: e.productId.sellingPrice * 100,
//           },
//           adjustable_quantity: {
//             enabled: true,
//             minimum: 1,
//           },
//           quantity: e.quantity,
//         };
//       }),
//       success_url: `${process.env.FRONTEND_URL}/payment-success`,
//       cancel_url: `${process.env.FRONTEND_URL}/payment-fail`, // cancel_url instead of fail_url
//     };

//     const session = await stripe.checkout.sessions.create(params);

//     res.status(303).json(session);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//       error: true,
//       success: false,
//     });
//   }
// };

// module.exports = paymentController;










const stripe = require("../config/stripe");
const userModel = require("../models/userModel");

const paymentController = async (req, res) => {
  try {
    const { cartProducts, shippingAddressId } = req.body;

    const user = await userModel.findOne({ _id: req.userId });
    // console.log(JSON.stringify(shippingAddress))
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_email: user.email,
      metadata: {
        userId: req.userId,
        shippingAddressId: shippingAddressId,
      },
      line_items: cartProducts.map((e) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: e.productId.productName,
              images: [e.productId.productPhoto[0].url], // images instead of photo
              metadata: {
                productId: e.productId._id,
                size: e.size,
                color: e.color,
              },
            },
            unit_amount: e.productId.sellingPrice * 100,
          },
          quantity: e.quantity,
          
        };
      }),
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-fail`,
    };

    const session = await stripe.checkout.sessions.create(params);

    res.status(303).json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

module.exports = paymentController;
