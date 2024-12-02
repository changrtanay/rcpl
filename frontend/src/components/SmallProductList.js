import React, { useContext, useEffect, useRef, useState } from "react";
import categoryProducts from "../helpers/categoryProducts";
import currencyFormat from "../helpers/currencyFormat";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import productCartStatus from "../helpers/productCartStatus"; // Import a helper to check cart status

const SmallProductList = ({ category, title }) => {
  const [productList, setProductList] = useState([]);
  const [loadingUi, setLoadingUi] = useState(true);
  const [addedProducts, setAddedProducts] = useState({}); // State to keep track of added products

  const loadingList = new Array(13).fill(null);
  const scrollElement = useRef();
  const { fetchCartProductsCount } = useContext(Context);

  const handleOnAddToCart = async (e, id) => {
    const dataApi = await addToCart(e, id);
    if (dataApi.success) {
      fetchCartProductsCount();
      checkCartStatus(productList); // Fetch updated cart status
    }
  };

  const fetchProductList = async () => {
    setLoadingUi(true);
    const dataApi = await categoryProducts(category);

    if (dataApi.success) {
      setLoadingUi(false);
      setProductList(dataApi?.data);
      checkCartStatus(dataApi?.data); // Check cart status after fetching products
    }
    if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  const checkCartStatus = async (products) => {
    setLoadingUi(true);
    const dataApi = await productCartStatus(); // Fetch cart status from the API
    const updatedAddedProducts = {};
    products.forEach((product) => {
      updatedAddedProducts[product._id] = dataApi.includes(product._id);
    });
    setLoadingUi(false);
    setAddedProducts(updatedAddedProducts); // Update state with cart status
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
    <div className="container mx-auto px-3.5 mt-3 pb-4 mb-4 border rounded-md relative bg-white shadow">
      <h2 className="text-2xl font-semibold py-2 mb-0.5">{title}</h2>

      <div
        className="flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none scroll-smooth transition-all pb-0.5"
        ref={scrollElement}
      >
        <button
          className="bg-red-600 text-white hover:bg-red-700 z-10 shadow-md rounded-full p-1 absolute left-1 text-lg hidden md:block "
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>
        <button
          className="bg-red-600 text-white hover:bg-red-700 z-10 shadow-md rounded-full p-1 absolute right-1 text-lg hidden md:block"
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>

        {loadingUi
          ? loadingList.map((e, i) => {
              return (
                <div
                  className="w-full min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex"
                  key={i}
                >
                  <div className="bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse"></div>
                  <div className="px-4 py-4 grid w-full gap-3">
                    <h2 className="p-0.5 bg-slate-200 animate-pulse rounded"></h2>
                    <p className="p-0.5 bg-slate-200 animate-pulse rounded"></p>
                    <p className="p-0.5 bg-slate-200 animate-pulse rounded"></p>
                    <button className="px-3 py-2 rounded-full w-full bg-slate-200 animate-pulse"></button>
                  </div>
                </div>
              );
            })
          : productList.map((e) => {
              return (
                <Link
                  to={"/product/" + e?._id}
                  className="w-full min-w-[320px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded shadow-md flex border"
                  key={e._id}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <div className="bg-slate-200 p-4 min-w-[120px] md:min-w-[145px] rounded">
                    <img
                      src={e.productPhoto[0].url}
                      className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
                      alt={e.productName}
                    />
                  </div>
                  <div className="pt-3 mb-2 px-4 grid">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                      {e?.productName}
                    </h2>
                    <p className="capitalize text-slate-500">{e?.category}</p>
                    <div className="flex gap-3 mb-1">
                      <p className="text-red-600 font-medium">
                        {currencyFormat(e?.sellingPrice)}
                      </p>
                      <p className="text-slate-500 line-through">
                        {currencyFormat(e?.mrp)}
                      </p>
                    </div>
                    <button
                      className={`text-sm px-3 py-1 rounded-full mb-2 ${
                        addedProducts[e._id]
                          ? "bg-red-400 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                      onClick={(ev) => handleOnAddToCart(ev, e?._id)}
                    >
                      {addedProducts[e._id] ? "Product Added" : "Add to Cart"}
                    </button>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default SmallProductList;
