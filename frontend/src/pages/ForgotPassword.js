import React, { useState } from "react";
import signInGif from "../assets/signin.gif";
import { Link } from "react-router-dom";
import Countdown from "../components/CountDown";
import { toast } from "react-toastify";
import summaryApi from "../common";

const ForgotPassword = () => {
  const [isEmailSent, setIsEmailSent] = useState(true);
  const [loadingUi, setLoadingUi] = useState(false);
  const [data, setData] = useState({
    email: "",
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
    const dataResponse = await fetch(summaryApi.forgotPassword.url, {
      method: summaryApi.forgotPassword.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      setIsEmailSent(false);
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    toast.info("Please Wait.")
    setLoadingUi(true);
    await fetchData();
    setLoadingUi(false);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] p-2 md:p-4 gap-3 flex flex-col justify-center ">
      <div className="mx-auto w-full max-w-sm p-5 px-3   bg-white transition-all">
        {loadingUi ? (
          <div className=" transition-all">
            <div className="flex justify-center">
              <div className=" mb-6 h-20 w-20 rounded-full text- bg-slate-200 transition-all animate-pulse"></div>
            </div>
            <div className="my-2 w-32 h-6 rounded bg-slate-200 animate-pulse"></div>
            <div className="my-2 h-8 bg-slate-200 animate-pulse"></div>
            <div className="flex justify-end">
              <div className="mb-6 w-32 h-5 rounded bg-slate-200 animate-pulse"></div>
            </div>
            <div className="flex justify-center">
              <div className="mt-4 w-36 h-10 rounded-full bg-slate-200 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div>
            {isEmailSent ? (
              <>
                <div className="flex justify-center items-center ">
                  <div className="w-20 h-20 mt-2 mb-6 rounded-full bg-slate-100 overflow-hidden">
                    <img src={signInGif} alt="sign in" />
                  </div>
                </div>
                <form className="flex flex-col " onSubmit={handleOnSubmit}>
                  <label htmlFor="email" className="select-none">
                    Enter Email:
                  </label>
                  <input
                    type={"email"}
                    id="email"
                    className="bg-slate-100  mt-2 py-1 px-2 rounded outline-none border-none"
                    name="email"
                    value={data.email}
                    onChange={handleOnChange}
                    required
                  />

                  <Link
                    to={"/sign-in"}
                    className="text-sm mt-2 select-none mb-8 text-right hover:text-red-600 hover:underline"
                  >
                    Remember Password?
                  </Link>

                  <button className="bg-red-600 mb-2 hover:bg-red-700 text-white p-1 select-none font-semibold mt-4 w-full max-w-[200px] m-auto rounded-full transition-all duration-600 hover:scale-105 drop-shadow">
                    Forgot Password
                  </button>
                </form>
              </>
            ) : (
              <>
                <Countdown email={data.email} againCall={handleOnSubmit} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
