import React, { useEffect, useState } from "react";
import summaryApi from "../common";
import moment from "moment";
import currencyFormat from "../helpers/currencyFormat";
import { Link } from "react-router-dom";

const Orders = () => {
  const [data, setData] = useState([]);

  const fetchOrderDetails = async () => {
    const dataResponse = await fetch(summaryApi.orders.url, {
      method: summaryApi.orders.method,
      credentials: "include",
    });

    const dataApi = await dataResponse.json();

    setData(dataApi.data);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  return (
    <div className="mb-5">
      {!data[0] && <p className="mx-auto p-4">No Orders yet</p>}
      {data[0] && (
        <div className="p-4 w-full ">
          <div className="px-4 py-3 bg-white rounded shadow-xl border">
            <h1 className="text-2xl font-medium mb-2">Your Orders</h1>
            {data.map((order, index) => {
              return (
                <div
                  key={order.userId + index}
                  className=" bg-white border  px-3 py-2 rounded-md shadow mb-6"
                >
                  <div className="flex md:flex-row flex-col gap-2">
                    <p className="font-medium text-lg ">
                      {moment(order.createdAt).format("D MMMM, YYYY")}
                    </p>
                    <div className="w-0.5 ml-2 md:block hidden bg-black"></div>
                    <p className="font-medium text-lg ">
                      Order ID: {order._id}
                    </p>
                  </div>
                  <div className=" rounded mt-2 ">
                    <div className="flex flex-col lg:flex-row gap-3">
                      <div className="grid gap-2">
                        {order?.productDetails.map((product, index) => {
                          return (
                            <div
                              key={product.productId + index}
                              className="flex gap-3 md:min-w-[750px] max-w-[750px] border h-32 md:h-28 border-slate-300 rounded "
                            >
                              <Link
                                to={"/product/" + product.productId}
                                className=""
                                key={product.productId}
                                onClick={() =>
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  })
                                }
                              >
                                <div className="cursor-pointer min-w-28 flex h-32 md:h-28 max-w-28 bg-slate-200">
                                  <img
                                    src={
                                      product.photo ||
                                      product.productPhoto[0].url
                                    }
                                    width={120}
                                    height={120}
                                    className="mix-blend-multiply object-scale-down p-2"
                                  />
                                </div>
                              </Link>
                              <div className="flex-col md:flex md:flex-row">
                                <div className="pt-2 min-w-[100px] md:min-w-[380px] lg:min-w-[400px]">
                                  <Link
                                    to={"/product/" + product.productId}
                                    className=""
                                    key={product.productId}
                                    onClick={() =>
                                      window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                      })
                                    }
                                  >
                                    <div className="cursor-pointer font-medium text-lg text-ellipsis line-clamp-1 md:pr-4">
                                      {product.productName}
                                    </div>
                                  </Link>
                                  <div className="flex md:flex-row md:items-center md:gap-2 text-sm md:text-base gap-1 mt-0.5">
                                    <div className="w-8 text-center rounded bg-gray-200 uppercase font-semibold text-red-500">
                                      {product.size}
                                    </div>
                                    <div className=" px-2 rounded bg-gray-200 capitalize font-semibold text-red-500">
                                      {product.color}
                                    </div>
                                  </div>
                                  <div className="flex md:flex-row md:items-center text-sm md:text-base md:gap-5 gap-1 mt-1.5">
                                    <div className="text-base md:text-lg min-w-16 text-red-500">
                                      {currencyFormat(product.price)}
                                    </div>
                                    <p>Quantity : {product.quantity}</p>
                                  </div>
                                </div>
                                <div className="md:flex md:items-center ">
                                  <p
                                    className={`py-1 p-1 md:min-w-36 min-w-36 bg-gray-200 text-sm md:text-base text-center font-semibold border rounded capitalize ${
                                      product.status === "pending"
                                        ? "text-yellow-500"
                                        : product.status === "confirmed"
                                        ? "text-blue-500"
                                        : product.status === "delivered"
                                        ? "text-green-500"
                                        : ""
                                    }`}
                                  >
                                    {product.status}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex flex-co xl:flex-row lg:flex-col flex-row lg:mb-1  gap-4 min-w-[300px]">
                        <div>
                          <div className="text-lg font-medium">
                            Payment Details:
                          </div>
                          <p className="flex flex-row gap-1 text-sm md:text-base">
                            Payment Method:
                            <div className="capitalize">
                              {order.paymentDetails.payment_method_type[0]}
                            </div>
                          </p>
                          <p className="flex flex-row gap-1 text-sm md:text-base">
                            Payment Status:
                            <div className="capitalize">
                              {order.paymentDetails.payment_status}
                            </div>
                          </p>
                        </div>
                        <div>
                          <div className="text-lg font-medium">
                            Shipping Details:
                          </div>
                          <p>Name: {order.shippingAddress.addressName}</p>
                          <p>Phone: {order.shippingAddress.addressPhone}</p>
                          <p>Address: {order.shippingAddress.address}</p>
                          <p>Pincode: {order.shippingAddress.pincode}</p>
                          {/* {order.shipping_options.map((shipping, index) => {
                            return (
                              <div
                                key={shipping.shipping_rate}
                                className=" ml-1"
                              >
                                Shipping Amount :{" "}
                                {currencyFormat(shipping.shipping_amount)}
                              </div>
                            );
                          })} */}
                        </div>
                      </div>
                    </div>

                    <div className="font-semibold ml-auto w-fit lg:text-lg">
                      Total Amount : {currencyFormat(order.totalAmount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
