import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  let handleOnFb = () => {
    window.open(`https://www.facebook.com/svetibyrajivcreation/?_rdr`);
  };
  let handleOnInsta = () => {
    window.open(`https://www.instagram.com/svetibyrajivcreation/`);
  };
  let handleOnAIBot = () => {
    window.open(`https://app.fastbots.ai/embed/${process.env.REACT_APP_FASTBOT_ID}`);
  };
  return (
    <footer className="bg-red-900 text-white relative z-60">
      <div className="container mx-auto p-4 flex justify-between">
        <div>
          <p className="font-semibold text-2xl">Rajiv Creation Pvt Ltd.</p>
          <div className="flex flex-col sm:flex-row sm:pt-0 pt-1">
            <p className="">(+91) 9830258001</p>
            <div className="hidden sm:block px-1 -mt-1 text-xl font-">|</div>
            <div className="flex">
              <p className="sm:hidden mr-1">(+91)</p>
              <p>9830085565</p>
            </div>
          </div>
          <p>10, Sir Hari Ram Goenka St. </p>
          <p>Kolkata-700007</p>
        </div>

        <div className="lg:flex lg:items-end hidden">
          © 2024 Rajiv Creation Pvt. Ltd. All rights reserved.
        </div>

        <div className="sm:mt-1 mt-36 text-right ">
        <button onClick={handleOnAIBot} className="underline font-bold">
              AI Bot
            </button>
        <p className="mt-">rajivcreationkol10@gmail.com </p>
          <p>We deliver all over India! </p>
          <div className="flex gap-0.5 text-lg justify-end pt-1.5">
            <button onClick={handleOnFb}>
              <FaFacebook />
            </button>
            <div className=" px-1 -mt-2.5 -mb-2 text-2xl font-thin">|</div>
            <button onClick={handleOnInsta}>
              <FaInstagram />
            </button>
          </div>
        </div>
      </div>
      <div className="text-center lg:hidden">
          © 2024 Rajiv Creation Pvt. Ltd. All rights reserved.
        </div>
    </footer>
  );
};

export default Footer;

{
  /* <div className="flex py-0.">
 <p className="">Exclusive & Authentic Ethnic Wear</p> 
 <div className=" px-1 -mt-1 text-xl font-">|</div> 
 <p className="">Ethnic Embroidery & Prints</p> 
</div> */
}
