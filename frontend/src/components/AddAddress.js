import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import summaryApi from "../common";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

const AddAddress = ({ handleOnClose, refresh }) => {
  const [data, setData] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnSave = async (e) => {
    e.preventDefault();
    const dataResponse = await fetch(summaryApi.addAddress.url, {
      method: summaryApi.addAddress.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      handleOnClose();
      refresh();
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  return (
    <div className="fixed w-full h-full top-0 bottom-0 left-0 right-0 flex z-10 justify-center items-center bg-slate-200 bg-opacity-50">
      <div className="bg-white pl-4 pr-2.5 pb-4 pt-3 rounded shadow-md max-w-xl w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium pt-1">Add New Address</h1>
          <button
            className="text-xl pr-0.5 hover:text-red-600 transition-all"
            onClick={handleOnClose}
          >
            <IoClose className="" />
          </button>
        </div>
        <div className="pr-0.5 mt-2 mr-0.5 max-h-[80%] overflow-hidden">
          <form
            className="pt-2 pr-4 flex flex-col gap-2 overflow-y-auto max-h-[70vh]"
            onSubmit={handleOnSave}
          >
            <div>
              <label htmlFor="name" className="">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={data.name}
                name="name"
                onChange={handleOnChange}
                placeholder="Enter Name"
                required
                className="w-full h-fit border rounded bg-slate-100 p-2"
              ></input>
            </div>
            <div>
              <label htmlFor="phone" className="">
                Phone Number:
              </label>
              <input
                type="Number"
                id="phone"
                value={data.phone}
                name="phone"
                onChange={handleOnChange}
                placeholder="Enter Phone Number"
                required
                className="w-full h-fit border rounded bg-slate-100 p-2"
              ></input>
            </div>
            <div>
              <label htmlFor="address" className="">
                Address:
              </label>
              <input
                type="text"
                id="address"
                value={data.address}
                name="address"
                onChange={handleOnChange}
                placeholder="Enter Address"
                required
                className="w-full h-fit border rounded bg-slate-100 p-2"
              ></input>
            </div>
            <div>
              <label htmlFor="pincode" className="">
                Pin Code:
              </label>
              <input
                type="Number"
                id="pincode"
                value={data.pincode}
                name="pincode"
                onChange={handleOnChange}
                placeholder="Enter Pin Code"
                required
                className="w-full h-fit border rounded bg-slate-100 p-2"
              ></input>
            </div>
            <div className="flex justify-center">
              <button className="flex justify-center my-4 px-5 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
