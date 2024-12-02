import React, { useState } from "react";
import ROLE from "../common/role";
import { IoClose } from "react-icons/io5";
import summaryApi from "../common";
import { toast } from "react-toastify";

const UpdateUser = ({ userId, name, email, role, handleOnClose, refresh }) => {
  const [updateUser, setUpdateUser] = useState(role);
  const handleOnChange = (e) => {
    setUpdateUser(e.target.value);
  };

  const handleOnSave = async () => {
    const dataResponse = await fetch(summaryApi.updateUser.url, {
      method: summaryApi.updateUser.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ userId: userId, role: updateUser }),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      handleOnClose();
      refresh()
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  return (
    <div className="fixed w-full h-full top-0 bottom-0 left-0 right-0 flex z-10 justify-center items-center bg-slate-200 bg-opacity-50 ">
      <div className="bg-white px-4 pb-4 pt-3 shadow-md max-w-sm w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium pt-1">Update User</h1>

          <button className="ml-auto hover:text-red-600 transition-all" onClick={handleOnClose}>
            <IoClose />
          </button>
        </div>

        <p className="pt-4">Name: {name}</p>
        <p className="">Email: {email}</p>

        <div className="flex items-center mt-0.5">
          <p className="">Role:</p>
          <div className="flex h-4 items-center">
            <select
              className="border text-center mt-1 mx-1 cursor-pointer"
              value={updateUser}
              onChange={handleOnChange}
            >
              {Object.values(ROLE).map((i) => {
                return (
                  <option className="cursor-pointer" key={i} value={i}>
                    {i}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="mt-5 px-5 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
            onClick={handleOnSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
