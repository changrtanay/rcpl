import React, { useEffect, useState } from "react";
import summaryApi from "../common";
import moment from "moment";
import currencyFormat from "../helpers/currencyFormat";
import { Link } from "react-router-dom";
import statusList from "../helpers/statusList";
import { toast } from "react-toastify";

const Orders = () => {
  const [data, setData] = useState([]);

  const fetchAllOrders = async () => {
    const dataResponse = await fetch(summaryApi.allOrders.url, {
      method: summaryApi.allOrders.method,
      credentials: "include",
    });

    const dataApi = await dataResponse.json();

    setData(dataApi.data);
  };

  // Function to handle status change and update it on the backend
  const handleOnChange = async (e, productId, orderId, color, size) => {
    const { value } = e.target;

    const dataResponse = await fetch(summaryApi.updateOrder.url, {
      method: summaryApi.updateOrder.method,
      credentials: "include",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        orderId,
        status: value,
        color, // Include color
        size, // Include size
      }),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      setData((prevData) =>
        prevData.map((order) =>
          order._id === orderId
            ? {
                ...order,
                productDetails: order.productDetails.map((product) =>
                  product.productId === productId &&
                  product.color === color &&
                  product.size === size // Match color and size
                    ? { ...product, status: value }
                    : product
                ),
              }
            : order
        )
      );
      toast.success(dataApi.message);
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="max-w-[calc(100vw-270px)]">
      {!data[0] && <p className="mx-auto p-4">No Orders yet</p>}
      {data[0] && (
        <div className="py-1  ">
          <div className="px-4 pb-3 pt-2 bg-white rounded">
            <h1 className="text-lg font-bold">All Orders</h1>
          </div>
          <div className="px-4 pb-3 mt-2 pt-2 bg-white rounded">
            {data.map((order, index) => {
              return (
                <div
                  key={order.userId + index}
                  className=" bg-white border px-3 py-2 rounded-md shadow mt-2 mb-4"
                >
                  <div className="flex md:flex-row flex-col gap-2">
                    <p className="font-medium text-lg ">
                      {moment(order.createdAt).format("D MMMM, YYYY")}
                    </p>
                    <div className="w-0.5 ml-0.5 md:block hidden bg-black"></div>
                    <p className="font-medium text-lg ">
                      Order ID: {order._id}
                    </p>
                  </div>
                  <div className=" rounded mt-2">
                    <div className="flex flex-col xl:flex-row gap-3">
                      <div className="grid gap-2">
                        {order?.productDetails.map((product, index) => {
                          return (
                            <div
                              key={product.productId + index}
                              className="flex gap-3 lg:min-w-[750px] max-w-[750px] border h-28 border-slate-300 rounded "
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
                                <div className="cursor-pointer h-full min-w-28 flex min-h-28 max-w-28 bg-slate-200">
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
                              <div className="pt-2 md:min-w-[170px] lg:min-w-[400px]">
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
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2 gap-1 mt-0.5">
                                  <div className="w-8 text-center rounded bg-gray-200 uppercase font-semibold text-red-500">
                                    {product.size}
                                  </div>
                                  <div className=" px-2 rounded bg-gray-200 capitalize font-semibold text-red-500">
                                    {product.color}
                                  </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-5 gap-1 mt-1.5">
                                  <div className="text-lg min-w-16 text-red-500">
                                    {currencyFormat(product.price)}
                                  </div>
                                  <p>Quantity: {product.quantity}</p>
                                </div>
                              </div>
                              <div className="md:flex md:items-center ">
                                <select
                                  required
                                  value={product.status}
                                  onChange={(e) =>
                                    handleOnChange(
                                      e,
                                      product.productId,
                                      order._id,
                                      product.color, // Pass color
                                      product.size // Pass size
                                    )
                                  }
                                  className={`py-1 p-1 md:min-w-36 min-w-44 border-black border rounded cursor-pointer ${
                                    product.status === "pending"
                                      ? "text-yellow-600"
                                      : product.status === "confirmed"
                                      ? "text-blue-600"
                                      : product.status === "delivered"
                                      ? "text-green-600"
                                      : ""
                                  }`}
                                >
                                  {statusList.map((e, i) => (
                                    <option
                                      className={`text-black bg-gray-100 ${
                                        e.value === "pending"
                                          ? "text-yellow-600"
                                          : e.value === "confirmed"
                                          ? "text-blue-600"
                                          : "text-green-600"
                                      }`}
                                      key={i + e.value}
                                      value={e.value}
                                    >
                                      {e.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex flex-col gap-2 mb-1 min-w-[300px]">
                        <div>
                          <div className="text-lg font-medium">
                            Payment Details:
                          </div>
                          <p className="flex flex-row gap-1">
                            Payment Method:
                            <div className="capitalize">
                              {order.paymentDetails.payment_method_type[0]}
                            </div>
                          </p>
                          <p className="flex flex-row gap-1">
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
