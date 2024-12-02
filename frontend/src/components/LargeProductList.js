import React, { useContext, useEffect, useRef, useState } from "react";
import categoryProducts from "../helpers/categoryProducts";
import currencyFormat from "../helpers/currencyFormat";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import addToCart from "../helpers/addToCart"; // New import for adding products to cart
import Context from "../context"; // Import context for managing cart state
import productCartStatus from "../helpers/productCartStatus"; // Import helper to check cart status

const LargeCardProduct = ({ category, title }) => {
  const [productList, setProductList] = useState([]);
  const [loadingUi, setLoadingUi] = useState(true);
  const [addedProducts, setAddedProducts] = useState({}); // State to track added products
  const loadingList = new Array(13).fill(null);
  const scrollElement = useRef();
  const { fetchCartProductsCount } = useContext(Context);

  const fetchProductList = async () => {
    setLoadingUi(true);
    const dataApi = await categoryProducts(category);

    if (dataApi.success) {
      setLoadingUi(false);
      setProductList(dataApi?.data);
      checkCartStatus(dataApi?.data); // Check cart status after fetching products
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  const handleOnAddToCart = async (e, id) => {
    const dataApi = await addToCart(e, id);
    if (dataApi.success) {
      fetchCartProductsCount();
      checkCartStatus(productList); // Fetch updated cart status
    }
  };

  const checkCartStatus = async (products) => {
    setLoadingUi(true);
    const status = await productCartStatus(); // Fetch cart status from the API
    const updatedAddedProducts = {};
    products.forEach((product) => {
      updatedAddedProducts[product._id] = status.includes(product._id);
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
    <div className="container mx-auto px-3.5 mt-3 pb-5 mb-6 relative bg-white shadow-md border rounded-md">
      <h2 className="text-2xl font-semibold py-2.5 mb-9.5">{title}</h2>
      <div
        className="flex items-center gap-3.5 md:gap-3.5 overflow-x-scroll scrollbar-none scroll-smooth transition-all"
        ref={scrollElement}
      >
        <button
          className="bg-red-600 text-white hover:bg-red-700 z-10 shadow-md rounded-full p-1 absolute left-1.5 text-lg hidden md:block "
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>
        <button
          className="bg-red-600 text-white hover:bg-red-700 z-10 shadow-md rounded-full p-1 absolute right-1.5 text-lg hidden md:block "
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>
        {loadingUi
          ? loadingList.map((product, i) => (
              <div
                key={i}
                className="w-full min-w-[220px] md:min-w-[280px] max-w-[280px] md:max-w-[320px] my-0.5 ml-0.5 rounded-md shadow-md"
              >
                <div className="bg-slate-200 h-36 p-4 min-w-[220px] md:min-w-[145px] flex justify-center items-center rounded-md animate-pulse"></div>
                <div className="p-4 grid gap-3">
                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200"></h2>
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
                className="w-full min-w-[220px] md:min-w-[280px] max-w-[280px] md:max-w-[320px] my-0.5 ml-0.5 rounded-md shadow-md"
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
              >
                <div className="bg-slate-200 h-32 md:h-36 p-4 min-w-[220px] md:min-w-[145px] flex justify-center items-center rounded-md">
                  <img
                    src={e.productPhoto[0].url}
                    className="object-scale-down h-28 md:h-32 hover:scale-110 transition-all mix-blend-multiply"
                    alt={e.productName}
                  />
                </div>
                <div className="px-4 pt-3 py-2 mb-2 grid">
                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                    {e?.productName}
                  </h2>
                  <p className="capitalize text-slate-500 mb-1.5">
                    {e?.category}
                  </p>
                  <div className="flex gap-3 mb-1">
                    <p className="text-red-600 font-medium">
                      {currencyFormat(e?.sellingPrice)}
                    </p>
                    <p className="text-slate-500 line-through">
                      {currencyFormat(e?.mrp)}
                    </p>
                  </div>
                  <button
                    className={`text-sm px-3 py-1.5 rounded-full ${
                      addedProducts[e._id]
                        ? "bg-red-400 text-white"
                        : "hover:bg-red-700 bg-red-600 text-white"
                    }`}
                    onClick={(ev) => handleOnAddToCart(ev, e?._id)}
                  >
                    {addedProducts[e._id] ? "Product Added" : "Add to Cart"}
                  </button>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default LargeCardProduct;
