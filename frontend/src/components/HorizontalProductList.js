import React, { useEffect, useRef, useState } from "react";
import categoryProducts from "../helpers/categoryProducts";
import currencyFormat from "../helpers/currencyFormat";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const HorizontalProductList = ({ category, title }) => {
  const [productList, setProductList] = useState([]);
  const [loadingUi, setLoadingUi] = useState(true);
  const loadingList = new Array(13).fill(null);
  const scrollElement = useRef();

  const fetchProductList = async () => {
    setLoadingUi(true);
    const dataApi = await categoryProducts(category);

    if (dataApi.success) {
      setLoadingUi(false);
      setProductList(dataApi?.data);
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
  };

  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
  };

  return (
    <div className="container mx-auto px-3.5 mt-3 pb-4 mb-6 relative bg-white shadow-md border rounded-md">
      <h2 className="text-2xl font-semibold py-2.5 mb-9.5">{title}</h2>
      <div
        className="flex items-center gap-3.5 sm:gap-3.5 overflow-x-scroll scrollbar-none scroll-smooth transition-all"
        ref={scrollElement}
      >
        <button
          className="bg-red-600 text-white hover:bg-red-700 z-10 shadow-md rounded-full p-1 absolute top-52 left-1.5 text-lg hidden sm:block "
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>
        <button
          className="bg-red-600 text-white hover:bg-red-700 z-10 shadow-md rounded-full p-1 absolute top-52 right-1.5 text-lg hidden sm:block "
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>
        {loadingUi
          ? loadingList.map((product, i) => (
              <div
                key={i}
                className="w-full min-w-[170px] sm:min-w-[230px] max-w-[230px] sm:max-w-[270px] my-0.5 ml-0.5 rounded-md shadow-md"
              >
                <div className="bg-slate-200 h-56 sm:h-60 p-4 min-w-[120px] sm:min-w-[45px] flex justify-center items-center rounded-md animate-pulse"></div>
                <div className="p-4 grid gap-3">
                  <h2 className="font-medium text-base sm:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200"></h2>
                  <p className="capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200 py-2"></p>
                  <div className="flex gap-3">
                    <p className="text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
                    <p className="text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
                  </div>
                  <button className="text-sm text-white px-3 rounded-full bg-slate-200 py-3.5 animate-pulse"></button>
                </div>
              </div>
            ))
          : productList.map((e, i) => (
              <Link
                key={i}
                to={"/product/" + e?._id}
                className="w-full min-w-[170px] sm:min-w-[230px] max-w-[170px] sm:max-w-[230px] my-0.5 ml-0.5 rounded-md shadow-md"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="bg-slate-200 h-44 sm:h-60 p-4 min-w-[120px] sm:min-w-[45px] flex justify-center items-center rounded-md">
                  <img
                    src={e.productPhoto[0].url}
                    className="object-scale-down h-52 sm:h-56 scale-110 md:scale-100 md:hover:scale-110 transition-all mix-blend-multiply"
                    alt={e.productName}
                  />
                </div>
                <div className="px-4 pt-3 pb-2 grid">
                  <div className="flex justify-between">
                    <h2 className="font-medium text-base sm:text-lg text-ellipsis block line-clamp-1 text-black">
                      {e?.productName}
                    </h2>

                    <div className="block text-right pt-1 w-16 sm:w-20 lg:w-24 ">
                      <p className="uppercase text-red-600 text-xs pl-3 sm:pl-1 text-ellipsis line-clamp-1">
                        {e?.size.join(" ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="capitalize text-slate-500 mb-1 -mt-1">
                      {e?.category}
                    </p>
                    <div className="block text-right -mt-1.5 w-16 sm:w-20 lg:w-24">
                      <p className="capitalize text-red-600 text-ellipsis line-clamp-1 text-xs pl-1 ">
                        {e?.color.join(" ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 mb-1">
                    <p className="text-red-600 font-medium">
                      {currencyFormat(e?.sellingPrice)}
                    </p>
                    <p className="text-slate-500 line-through">
                      {currencyFormat(e?.mrp)}
                    </p>
                  </div>
                  <button className="text-sm px-3 py-1.5 mb-1 rounded-full hover:bg-red-700 bg-red-600 text-white">
                    View Product
                  </button>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default HorizontalProductList;
