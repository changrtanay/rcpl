import React, { useEffect, useState } from "react";
import b1 from "../assets/banner/b1.png";
import b2 from "../assets/banner/b2.png";
import b3 from "../assets/banner/b3.png";
import b1_m from "../assets/banner/b1_m.png";
import b2_m from "../assets/banner/b2_m.png";
import b3_m from "../assets/banner/b3_m.png";
import banner1 from "../assets/banner/img1.webp";
import banner2 from "../assets/banner/img2.webp";
import banner3 from "../assets/banner/img3.jpg";
import banner4 from "../assets/banner/img4.jpg";
import banner5 from "../assets/banner/img5.webp";
import banner1_m from "../assets/banner/img1_mobile.jpg";
import banner2_m from "../assets/banner/img2_mobile.webp";
import banner3_m from "../assets/banner/img3_mobile.jpg";
import banner4_m from "../assets/banner/img4_mobile.jpg";
import banner5_m from "../assets/banner/img5_mobile.png";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

const Banner = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loadingUi, setLoadingUi] = useState(true); // Step 2: Define loading state

  // const desktopBanners = [banner1, banner2, banner3, banner4, banner5];
  // const mobileBanners = [banner1_m, banner2_m, banner3_m, banner4_m, banner5_m];
  const desktopBanners = [b1, b2, b3];
  const mobileBanners = [b1_m, b2_m, b3_m];;

  const nextBanner = () => {
    if (desktopBanners.length - 1 > currentBanner) {
      setCurrentBanner((prev) => prev + 1);
    }
  };

  const prevBanner = () => {
    if (currentBanner !== 0) {
      setCurrentBanner((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (desktopBanners.length - 1 > currentBanner) {
        nextBanner();
      } else {
        setCurrentBanner(0);
      }
    }, 6000);

    // Step 4: Update useEffect to handle loading state
    setLoadingUi(false); // Once banners are loaded, set loadingUi to false

    return () => clearInterval(interval);
  }, [currentBanner]);

  const directScroll = (number) => {
    setCurrentBanner(number);
  };

  // Step 3: Define loading list for placeholders
  const loadingList = new Array(desktopBanners.length).fill(null);

  return (
    <div className="container mx-auto">
      <div className="h-56 md:h-72 w-full bg-slate-200 relative rounded-lg overflow-hidden">
        {/* Navigation buttons */}
        <div className="absolute z-10 h-full w-full md:flex items-center flex">
          <div className="flex justify-between w-full text-2xl px-4">
            <button
              onClick={prevBanner}
              className={`bg-white shadow-md rounded-full p-1 ${
                loadingUi && "animate-pulse"
              }`}
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={nextBanner}
              className={`bg-white shadow-md rounded-full p-1 ${
                loadingUi && "animate-pulse"
              }`}
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* Desktop Banners */}
        <div className="hidden md:flex h-full w-full overflow-hidden">
          {loadingUi
            ? loadingList.map((_, index) => (
                <div className="transition-all animate-pulse">
                  <div
                    key={index}
                    className="w-full h-full min-w-full min-h-full transition-all"
                    style={{
                      transform: `translateX(-${currentBanner * 100}%)`,
                    }}
                  >
                    <div className="w-full h-full bg-slate-200 "></div>
                  </div>
                </div>
              ))
            : desktopBanners.map((bannerUrl, index) => (
                <div
                  className="w-full h-full min-w-full min-h-full transition-all"
                  key={bannerUrl}
                  style={{ transform: `translateX(-${currentBanner * 100}%)` }}
                >
                  <img
                    src={bannerUrl}
                    className="w-full h-full object-fill rounded-lg"
                  />
                </div>
              ))}
        </div>

        {/* Mobile Banners */}
        <div className="flex h-full w-full overflow-hidden md:hidden">
          {loadingUi
            ? loadingList.map((_, index) => (
                <div className="transition-all animate-pulse">
                  <div
                    key={index}
                    className="w-full h-full min-w-full min-h-full transition-all animate-pulse"
                    style={{
                      transform: `translateX(-${currentBanner * 100}%)`,
                    }}
                  >
                    <div className="w-full h-full bg-slate-200"></div>
                  </div>
                </div>
              ))
            : mobileBanners.map((bannerUrl, index) => (
                <div
                  className="w-full h-full min-w-full min-h-full transition-all"
                  key={bannerUrl}
                  style={{ transform: `translateX(-${currentBanner * 100}%)` }}
                >
                  <img
                    src={bannerUrl}
                    className="w-full h-full object-fill rounded-lg "
                  />
                </div>
              ))}
        </div>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center mt-2">
        <div className="flex justify-center gap-2 z-40 p-1.5 hover:bg-slate-300 rounded-full">
          {desktopBanners.map((_, index) => (
            <div
              key={index}
              className={`p-1.5 rounded-full bg-slate-500 transition-all cursor-pointer ${
                currentBanner === index && "bg-slate-900"
              } ${loadingUi && "animate-pulse"}`}
              onClick={() => directScroll(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;  