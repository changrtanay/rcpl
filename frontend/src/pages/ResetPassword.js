import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import summaryApi from "../common";
import { toast } from "react-toastify";

const ResetPassoword = () => {
  const navigate = useNavigate();
  const [newShowPass, setNewShowPass] = useState(false);
  const [confirmShowPass, setconfirmShowPass] = useState(false);
  const { id } = useParams();

  const [data, setData] = useState({
    _id: id,
    newPassword: "",
    confirmPassword: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const fetchData = async () => {
    const dataResponse = await fetch(summaryApi.resetPassword.url, {
      method: summaryApi.resetPassword.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      navigate("/");
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = data;

    if (newPassword === confirmPassword) {
      await fetchData();
    } else {
        toast.error("Please confirm password correctly.")
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] p-2 md:p-4 gap-3 flex flex-col justify-center ">
      <div className="mx-auto w-full max-w-sm shadow-md px-4   bg-white rounded">
        {
          <>
            <form className="flex flex-col my-4" onSubmit={handleOnSubmit}>
              <label htmlFor="email" className="select-none">
                New Password
              </label>
              <div className="bg-slate-100 mb-2 mt-1 py-1 px-2 rounded flex items-center">
                <input
                  type={newShowPass ? "text" : "password"}
                  id="newPassword"
                  className="bg-slate-100 w-full outline-none border-none text-base"
                  name="newPassword"
                  value={data.newPassword}
                  onChange={handleOnChange}
                  required
                />
                <span
                  className="text-lg cursor-pointer"
                  onClick={() => setNewShowPass((preve) => !preve)}
                >
                  {newShowPass ? <TbEyeClosed /> : <FaEye />}
                </span>
              </div>

              <label htmlFor="email" className="select-none">
                Confirm Password
              </label>
              <div className="bg-slate-100 mb-2 mt-1 py-1 px-2 rounded flex items-center">
                <input
                  type={confirmShowPass ? "text" : "password"}
                  id="confirmPassword"
                  className="bg-slate-100 w-full outline-none border-none text-base"
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  required
                />
                <span
                  className="text-lg cursor-pointer"
                  onClick={() => setconfirmShowPass((preve) => !preve)}
                >
                  {confirmShowPass ? <TbEyeClosed /> : <FaEye />}
                </span>
              </div>

              <button className="bg-red-600 hover:bg-red-700 text-white p-1 select-none font-semibold mt-6 mb-1 w-full max-w-[200px] m-auto rounded-full transition-all duration-600 hover:scale-105 drop-shadow">
                Submit
              </button>
            </form>
          </>
        }
      </div>
    </div>
  );
};

export default ResetPassoword;
