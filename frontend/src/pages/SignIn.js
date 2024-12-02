import React, { useContext, useState } from "react";
import loginIcons from "../assets/signin.gif";
import { FaEye } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import summaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../context";
import { FaGoogle } from "react-icons/fa";

const SignIn = () => {
  let [showPassword, setShowPassword] = useState(false);
  let [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchCartProductsCount } = useContext(Context);

  let handleOnGoogleSignIn = () => {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/google`, "_self");
  };

  let handleOnChange = (e) => {
    let { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  let handleOnSubmit = async (e) => {
    e.preventDefault();

    const dataResponse = await fetch(summaryApi.signIn.url, {
      method: summaryApi.signIn.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      navigate("/");
      fetchUserDetails();
      fetchCartProductsCount();
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  return (
    <section id="signIn">
      <div className="py-6 container p-4 flex flex-col-reverse lg:flex-row gap-16 items-center justify-center">
        <div className="bg-white p-2 py-5 w-full max-w-md ">
          <div className="w-20 h-20 mx-auto overflow-hidden rounded-full">
            <img src={loginIcons} alt="Sign in icon" />
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleOnSubmit}>
            <div className="">
              <label>Email: </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                placeholder="Enter Email"
                required
                className="w-full h-full outline-none bg-slate-100 p-2"
              />
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
              <Link
                to={"/forgot-password"}
                className="block w-fit ml-auto hover:underline hover:text-red-600"
              >
                Forgot Password?
              </Link>
            </div>

            <button className="bg-red-600 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 hover:bg-red-700">
              Sign in
            </button>
          </form>

          <p className="mt-4">
            Don't have an account?{" "}
            <Link
              to={"/sign-up"}
              className="text-red-600 hover:text-red-700 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
        <div className="min-h-60 w-0.5 hidden lg:block bg-red-600 rounded-full"></div>
        <div className="min-h-0.5 w-80 block lg:hidden bg-red-600 rounded-full"></div>
        <button 
          className="bg-white shadow-md rounded-md items-center flex gap-2 px-8 py-2 text-black font-semibold hover:bg-red-600 hover:text-white"
          onClick={handleOnGoogleSignIn}>
          <span>
            <FaGoogle />
          </span>
          Sign in with Google
        </button>
      </div>
    </section>
  );
};

export default SignIn;
