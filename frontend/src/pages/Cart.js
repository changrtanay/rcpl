import React, { useContext, useEffect, useState } from "react";
import summaryApi from "../common";
import Context from "../context";
import currencyFormat from "../helpers/currencyFormat";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import AddAddress from "../components/AddAddress";
import UpdateAddress from "../components/UpdateAddress";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(4).fill(null);

  const [addAddressPanel, setAddAddressPanel] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [updateAddressPanel, setUpdateAddressPanel] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [checkedAddress, setCheckedAddress] = useState(null);

  const fetchData = async () => {
    const dataResponse = await fetch(summaryApi.cartProducts.url, {
      method: summaryApi.cartProducts.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      setData(dataApi.data);
    }
  };

  const handleOnLoading = async () => {
    setLoading(true);
    await fetchAddresses();
    await fetchData();
    setLoading(false);
  };

  const handleOnCheck = (e) => {
    const { value } = e.target;
    const selectedAddr = addresses.find((addr) => addr._id === value);
    setCheckedAddress(selectedAddr);
  };

  useEffect(() => {
    handleOnLoading();
  }, []);

  let fetchAddresses = async () => {
    const dataResponse = await fetch(summaryApi.address.url, {
      method: summaryApi.address.method,
      credentials: "include",
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      setAddresses(dataApi.data);
      if (dataApi.data.length > 0) {
        setCheckedAddress(dataApi.data[0]);
      }
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  const checkCartStock = async () => {
    const dataResponse = await fetch(summaryApi.cartProducts.url, {
      method: summaryApi.cartProducts.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      const outOfStockItems = dataApi.data.some((e) => {
        const selectedSizeStock = e.productId.quantity.find(
          (q) => q.size === e.size
        );
        const selectedColorStock = selectedSizeStock?.colors.find(
          (c) => c.color === e.color
        );
        return selectedColorStock?.quantity <= 0; // Return true if any item is out of stock
      });

      if (outOfStockItems) {
        toast.error(
          "Some items in your cart are out of stock. Please update your cart."
        );
        return false; // Return false to indicate out-of-stock items are present
      }

      return true; // Return true if all items are in stock
    }

    return false; // Handle the case where API call fails
  };

  const handlePayNow = async () => {
    if (!checkedAddress) {
      toast.error("Please add your address");
      return;
    }
    // Check if all cart items are in stock before proceeding
    const allItemsInStock = await checkCartStock();

    if (!allItemsInStock) {
      return; // Exit if there are any out-of-stock items
    }

    toast.info("Redirecting to Stripe Gateway");
    const stripePromise = await loadStripe(
      process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
    );
    const dataResponse = await fetch(summaryApi.payment.url, {
      method: summaryApi.payment.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        cartProducts: data,
        shippingAddressId: checkedAddress._id,
      }),
    });

    const dataApi = await dataResponse.json();

    if (dataApi?.id) {
      stripePromise.redirectToCheckout({ sessionId: dataApi.id });
    }
  };

  const handlePayLater = async () => {
    if (!checkedAddress) {
      toast.error("Please add your address");
      return;
    }
    // Check if all cart items are in stock before proceeding
    const allItemsInStock = await checkCartStock();

    if (!allItemsInStock) {
      return; // Exit if there are any out-of-stock items
    }

    const orderData = {
      productDetails: data.map((item) => ({
        productId: item.productId._id,
        productName: item.productId.productName,
        productPhoto: item.productId.productPhoto,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.productId.sellingPrice,
        status: "pending"
      })),
      // email: ,
      userId: data[0].userId,
      shippingAddress: {
        addressId: checkedAddress._id,
        addressName: checkedAddress.name,
        addressPhone: checkedAddress.phone,
        address: checkedAddress.address,
        pincode: checkedAddress.pincode,
      },
      paymentDetails: {
        paymentId: "",
        payment_method_type: "NA",
        payment_status: "Later",
      },
      shipping_options: [],
      totalAmount: totalPrice,
    };

    const dataResponse = await fetch(summaryApi.addOrder.url, {
      method: summaryApi.addOrder.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ orderData }),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      setLoading(true);
      fetchData();
      context.fetchCartProductsCount();
      setLoading(false);
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  const increaseQty = async (id, qty, maxStock) => {
    if (qty >= maxStock) {
      toast.error("Cannot increase, out of stock!"); // Prevent increasing if out of stock
      return;
    }
    const dataResponse = await fetch(summaryApi.updateCartProduct.url, {
      method: summaryApi.updateCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
        quantity: qty + 1,
      }),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      fetchData();
      context.fetchCartProductsCount();
    }
  };

  const decreaseQty = async (id, qty) => {
    if (qty === 1) {
      // If quantity is 1, remove the product from cart
      deleteCartProduct(id);
    } else if (qty > 1) {
      const dataResponse = await fetch(summaryApi.updateCartProduct.url, {
        method: summaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          quantity: qty - 1,
        }),
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        fetchData();
        context.fetchCartProductsCount();
      }
    }
  };

  const deleteCartProduct = async (id) => {
    const dataResponse = await fetch(summaryApi.removeCartProduct.url, {
      method: summaryApi.removeCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
      }),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      fetchData();
      context.fetchCartProductsCount();
      toast.info("Product Removed from Cart");
    }
  };

  const totalQty = data.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    0
  );
  const totalPrice = data.reduce(
    (preve, curr) => preve + curr.quantity * curr?.productId?.sellingPrice,
    0
  );

  return (
    <div className="container mx-auto px-4 lg:min-h-fit lg:mb-0 mb-72">
      <div className="text-center text-lg my-3">
        {data.length === 0 && !loading && (
          <p className="bg-white py-5">Cart is empty</p>
        )}
      </div>

      {data.length !== 0 && (
        <div className="flex flex-col lg:flex-row gap-6 lg:justify-between md:px-4 py-2 pb-6">
          {/***view product */}
          <div className="w-full max-w-[790px] bg-white p-4 pt-2 pb-3 rounded-md shadow-md">
            {loading ? (
              <>
                <h1 className="text-2xl p-4 bg-slate-200 font-medium animate-pulse border border-slate-300"></h1>
                {loadingCart?.map((el, index) => {
                  return (
                    <div
                      key={el + "Add To Cart Loading" + index}
                      className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                    ></div>
                  );
                })}
              </>
            ) : (
              <>
                <h1 className="text-2xl font-medium">Cart</h1>
                {data.map((e, index) => {
                  // Find stock for the selected size and color
                  const selectedSizeStock = e.productId.quantity.find(
                    (q) => q.size === e.size
                  );
                  const selectedColorStock = selectedSizeStock?.colors.find(
                    (c) => c.color === e.color
                  );
                  const isOutOfStock = selectedColorStock?.quantity <= 0;
                  return (
                    <div
                      key={e?._id + "Add To Cart Loading"}
                      className={`w-full bg-white md:h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr] ${
                        isOutOfStock ? "" : ""
                      }`}
                    >
                      <Link
                        to={"/product/" + e?.productId._id}
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                      >
                        <div
                          className={`w-32 md:h-32 h-full bg-slate-200 ${
                            isOutOfStock ? "opacity-50" : ""
                          }`}
                        >
                          <img
                            src={e?.productId?.productPhoto[0].url}
                            className="w-full h-full object-scale-down mix-blend-multiply"
                          />
                        </div>
                      </Link>
                      <div className="px-4 pt-1 pb-2 relative">
                        {/**delete product */}
                        <div
                          className="absolute right-2 top-2 z-10 bg-red-500 text-white hover:bg-red-600 rounded-full p-1 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent event from propagating to Link
                            deleteCartProduct(e?._id);
                          }}
                        >
                          <MdDelete />
                        </div>

                        <Link
                          to={"/product/" + e?.productId._id}
                          onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }
                        >
                          <h2
                            className={`text-lg lg:text-xl text-ellipsis line-clamp-1 pr-6 ${
                              isOutOfStock ? "opacity-50" : ""
                            }`}
                          >
                            {e?.productId?.productName}
                          </h2>{" "}
                        </Link>
                        {/* <p className="capitalize text-slate-500 -mt-1 ">
                          {e?.productId.category}
                        </p> */}

                        <div
                          className={`flex gap-2 font-semibold text-red-600 mt-2 ${
                            isOutOfStock ? "opacity-50" : ""
                          }`}
                        >
                          <p className="uppercase bg-gray-200 px-2 rounded">
                            {e?.size}
                          </p>

                          <p className="uppercase bg-gray-200 px-2 rounded">
                            {e?.color}
                          </p>
                        </div>

                        <div
                          className={`flex md:flex-row flex-col md:items-center md:justify-between -mt-0 ${
                            isOutOfStock ? "opacity-50" : ""
                          }`}
                        >
                          <p className="text-red-600 font-medium text-lg">
                            {currencyFormat(e?.productId?.sellingPrice)}
                          </p>
                          <p className="text-slate-600 font-semibold text-lg">
                            {currencyFormat(
                              e?.productId?.sellingPrice * e?.quantity
                            )}
                          </p>
                        </div>

                        {isOutOfStock ? (
                          <span className="text-red-600 mt-1 font-semibold">
                            Out of Stock
                          </span> // Display "Out of Stock" message
                        ) : (
                          <div className="inline-flex shadow items-center gap-3 mt-">
                            <button
                              className="relative bg-red-500 text-white text-5xl hover:bg-red-700 w-6 h-6 flex justify-center rounded"
                              onClick={() => decreaseQty(e?._id, e?.quantity)}
                            >
                              <p className="absolute -top-5">-</p>
                            </button>
                            <span className="flex items-center">
                              {e?.quantity}
                            </span>
                            <button
                              className="relative bg-red-500 text-white text-3xl font-bold hover:bg-red-700 w-6 h-6 flex justify-center rounded"
                              onClick={() =>
                                increaseQty(
                                  e?._id,
                                  e?.quantity,
                                  selectedColorStock.quantity
                                )
                              }
                            >
                              <p className="absolute -top-2.5">+</p>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div className="flex flex-col z-10 w-full gap-6 lg:max-w-[395px] max-h-[194px] max-w-[790px]">
            {/***summary  */}
            <div className="mt-5 border lg:mt-0 w-full lg:max-w-[395px] min-h-[242px] max-h-[242px] max-w-[790px] bg-white p-4 rounded-md shadow-md">
              {loading ? (
                <div className="mt-1 h-32 bg-slate-200 border border-slate-300 animate-pulse"></div>
              ) : (
                <div className="h-36 bg-white">
                  <h2 className="text-white bg-red-600 px-4 py-1">Summary</h2>
                  <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                    <p>Quantity</p>
                    <p>{totalQty}</p>
                  </div>

                  <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                    <p>Total Price</p>
                    <p>{currencyFormat(totalPrice)}</p>
                  </div>

                  <button
                    className="bg-green-500 p-2 text-white w-full mt-2 hover:bg-green-600"
                    onClick={handlePayNow}
                  >
                    Pay Now
                  </button>

                  <p className="flex justify-center">or</p>
                  <button
                    className="bg-blue-600 p-2 text-white w-full mt-2 hover:bg-blue-700 transition-all"
                    onClick={handlePayLater}
                  >
                    Pay Later
                  </button>
                </div>
              )}
            </div>

            {/***address  */}
            <div className="mt-5 border lg:mt-0 w-full lg:max-w-[395px] max-h-[194px] lg:max-h-[250px] max-w-[790px] bg-white p-3 pr-2 rounded-md shadow-md">
              {loading ? (
                <div>
                  <div className="flex flex-row justify-between mb-3">
                    <p className="mt-1 h-5 w-40 rounded bg-slate-200 border border-slate-300 animate-pulse"></p>
                    <div className="mt-1 h-5 w-28 rounded-full bg-slate-200 border border-slate-300 animate-pulse"></div>
                  </div>
                  <div className="mt-1 h-28 bg-slate-200 border border-slate-300 animate-pulse"></div>
                </div>
              ) : (
                <div className="max-h-[300px] bg-white relative overflow-hidden">
                  <div className="flex justify-between items-center w-full shadow-sm">
                    <h2 className="text-lg font-semibold pb-1">
                      Your Address:
                    </h2>

                    <button
                      className="mr-0.5 py- px-2.5 rounded-full bg-white font-semibold text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all"
                      onClick={() => setAddAddressPanel(true)}
                    >
                      New Address
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <p className="bg-white pb-20 my-2">Please Add Address</p>
                  ) : (
                    <form className="text-sm flex flex-col gap-2 py-2 mt-2 overflow-y-scroll max-h-44 lg:max-h-48 scrollbar-none">
                      {addresses.map((e, index) => (
                        <label
                          key={e._id}
                          className="flex items-center md:gap-3 gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="address"
                            required
                            className="cursor-pointer"
                            onChange={handleOnCheck}
                            value={e._id}
                            checked={checkedAddress?._id === e._id}
                          />
                          <div className="flex relative flex-col border hover:border-red-600 border-slate-300 rounded w-full px-2">
                            <div>{e.name}</div>
                            <div>{e.phone}</div>
                            <div>{e.address}</div>
                            <div>{e.pincode}</div>

                            <button
                              type="button"
                              className="p-1 hover:bg-red-600 text-white rounded-full bg-red-500 absolute top-2 right-2"
                              onClick={(event) => {
                                event.stopPropagation(); // Prevent the radio button from being checked
                                setSelectedAddress(e);
                                setUpdateAddressPanel(true);
                              }}
                            >
                              <MdEdit />
                            </button>
                          </div>
                        </label>
                      ))}
                    </form>
                  )}
                </div>
              )}
            </div>

            {addAddressPanel && (
              <AddAddress
                handleOnClose={() => setAddAddressPanel(false)}
                refresh={fetchAddresses}
              />
            )}

            {updateAddressPanel && selectedAddress && (
              <UpdateAddress
                address={selectedAddress}
                handleOnClose={() => setUpdateAddressPanel(false)}
                refresh={fetchAddresses}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
