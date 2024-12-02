import React, { useState } from "react";
import loginIcons from "../assets/signin.gif";
import { FaEye } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import imageToBase64 from "../helpers/imageToBase64";
import summaryApi from "../common";
import { toast } from "react-toastify";

const SignUp = () => {
  let [showPassword, setShowPassword] = useState(false);
  let [showConfirmPassword, setShowConfirmPassword] = useState(false);
  let [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profilePhoto: "",
  });

  const navigate = useNavigate();

  let handleOnChange = (e) => {
    let { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  let handleOnSubmit = async (e) => {
    e.preventDefault();

    if (data.password === data.confirmPassword) {
      const dataResponse = await fetch(summaryApi.signUp.url, {
        method: summaryApi.signUp.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/sign-in");
      } else if (dataApi.error) {
        toast.error(dataApi.message);
      }
    } else {
      toast.error("Passwords don't match. <br />Please confirm password.");
    }
  };

  let handleOnPhotoUpload = async (e) => {
    const file = e.target.files[0];

    const image = await imageToBase64(file);

    setData((prev) => {
      return {
        ...prev,
        profilePhoto: image,
      };
    });
  };

  return (
    <section id="SignUp">
      <div className="mx-auto container p-4">
        <div className="bg-white p-2 py-5 w-full max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
            <div>
              <img src={data.profilePhoto || loginIcons} alt="sign in icon" />
            </div>
            <form>
              <label>
                <div className="text-xs bg-opacity-80 pt-2 pb-4 bg-slate-200 text-center absolute bottom-0 w-full py-4">
                  Upload Photo
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleOnPhotoUpload}
                />
              </label>
            </form>
          </div>

          <form className="pt-6" onSubmit={handleOnSubmit}>
            <div className="flex flex-col gap-2">
              <div className="">
                <label>Name: </label>
                <div className="bg-slate-100 p-2">
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleOnChange}
                    placeholder="Enter Name"
                    required
                    className="w-full h-full outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="">
                <label>Email: </label>
                <div className="bg-slate-100 p-2">
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleOnChange}
                    placeholder="Enter Email"
                    required
                    className="w-full h-full outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="">
                <label>Password: </label>
                <div className="bg-slate-100 p-2 flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={handleOnChange}
                    placeholder="Enter Password"
                    required
                    className="w-full h-full outline-none bg-transparent"
                  />
                  <div
                    className="cursor-pointer text-xl px-1"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <TbEyeClosed /> : <FaEye />}
                  </div>
                </div>
              </div>

              <div>
                <label>Confirm Password: </label>
                <div className="bg-slate-100 p-2 flex items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleOnChange}
                    placeholder="Confirm Password"
                    required
                    className="w-full h-full outline-none bg-transparent"
                  />
                  <div
                    className="cursor-pointer text-xl px-1"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <TbEyeClosed /> : <FaEye />}
                  </div>
                </div>
              </div>

              <button className="bg-red-600 text-white px-6 py-2 mb-4 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4 hover:bg-red-700">
                Sign Up
              </button>
            </div>
          </form>
          <span>
          Already have an account? {" "}
          <Link
            to={"/sign-in"}
            className="text select-none mb-8 text-right text-red-600 hover:underline"
          >
            Log In 
          </Link></span>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
