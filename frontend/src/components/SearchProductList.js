// import React, { useContext, useEffect, useState } from "react";
// import currencyFormat from "../helpers/currencyFormat";
// import Context from "../context";
// import addToCart from "../helpers/addToCart";
// import { Link } from "react-router-dom";
// import productCartStatus from "../helpers/productCartStatus";

// const SearchProductList = ({ loadingUi, data = [] }) => {
//   const loadingList = new Array(13).fill(null);
//   const [productList, setProductList] = useState([]);
//   const [addedProducts, setAddedProducts] = useState({}); // State to track added products
//   const { fetchCartProductsCount } = useContext(Context);

//   const checkCartStatus = async (products) => {
//     const status = await productCartStatus(); // Fetch cart status from the API
//     const updatedAddedProducts = {};
//     products.forEach((product) => {
//       updatedAddedProducts[product._id] = status.includes(product._id);
//     });
//     setAddedProducts(updatedAddedProducts); // Update state with cart status
//   };

//   const handleOnAddToCart = async (e, id) => {
//     const dataApi = await addToCart(e, id);
//     if (dataApi.success) {
//       fetchCartProductsCount();
//       checkCartStatus(productList); // Fetch updated cart status
//     }
//   };

//   useEffect(() => {
//     setProductList(data);
//     checkCartStatus(data); // Check cart status after fetching products
//   }, []);

//   return (
//     <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,300px))] md:grid-cols-[repeat(auto-fit,minmax(240px,300px))]  gap-4 overflow-x-scroll scrollbar-none transition-all p-1">
//       {/* <div className="flex flex-wrap max-w-[1800px] overflow-x-scroll scrollbar-none transition-all "> */}

//       {loadingUi
//         ? loadingList.map((e, i) => (
//             <div
//               key={i}
//               className="w-full min-w-[220px] md:min-w-[280px] max-w-[280px] md:max-w-[320px] my-0.5 mx-2 ml-0.5 rounded-md shadow-md"
//             >
//               <div className="bg-slate-200 h-36 p-4 min-w-[220px] md:min-w-[145px] flex justify-center items-center rounded-md animate-pulse"></div>
//               <div className="p-4 grid gap-3">
//                 <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200"></h2>
//                 <p className="capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200 py-2"></p>
//                 <div className="flex gap-3">
//                   <p className="text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
//                   <p className="text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
//                 </div>
//                 <button className="text-sm text-white px-3 rounded-full bg-slate-200 py-3.5 animate-pulse"></button>
//               </div>
//             </div>
//           ))
//         : data.map((e, i) => (
//             <Link
//               key={i}
//               to={"/product/" + e?._id}
//               className="md:w-full min-w-[200px] md:min-w-[280px] max-w-[280px] md:max-w-[320px] my-0.5 ml-0.5 mx-2 rounded-md shadow-md"
//               onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//             >
//               <div className="bg-slate-200 h-32 md:h-36 p-4 min-w-[145px] md:min-w-[220px] flex justify-center items-center rounded-md">
//                 <img
//                   src={e.productPhoto[0]}
//                   className="object-scale-down h-28 md:h-32 hover:scale-110 transition-all mix-blend-multiply"
//                   alt={e.productName}
//                 />
//               </div>
//               <div className="px-4 pt-3 py-2 mb-2 grid">
//                 <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
//                   {e?.productName}
//                 </h2>
//                 <p className="capitalize text-slate-500 mb-1.5">
//                   {e?.category}
//                 </p>
//                 <div className="flex gap-3 mb-1">
//                   <p className="text-red-600 font-medium">
//                     {currencyFormat(e?.sellingPrice)}
//                   </p>
//                   <p className="text-slate-500 line-through">
//                     {currencyFormat(e?.mrp)}
//                   </p>
//                 </div>
//                 <button
//                   className={`text-sm px-3 py-1.5 rounded-full ${
//                     addedProducts[e._id]
//                       ? "bg-red-400 text-white"
//                       : "hover:bg-red-700 bg-red-600 text-white"
//                   }`}
//                   onClick={(ev) => handleOnAddToCart(ev, e?._id)}
//                 >
//                   {addedProducts[e._id] ? "Product Added" : "Add to Cart"}
//                 </button>
//               </div>
//             </Link>
//           ))}
//     </div>
//   );
// };

// export default SearchProductList;

import React, { useContext, useEffect, useState } from "react";
import currencyFormat from "../helpers/currencyFormat";
import Context from "../context";
import addToCart from "../helpers/addToCart";
import { Link, useNavigate, useLocation } from "react-router-dom";
import productCartStatus from "../helpers/productCartStatus";

const ITEMS_PER_PAGE = 15; // Number of items per page

const SearchProductList = ({ loadingUi, data = [] }) => {
  const loadingList = new Array(ITEMS_PER_PAGE).fill(null);
  const [productList, setProductList] = useState([]);
  // const [addedProducts, setAddedProducts] = useState({});
  // const { fetchCartProductsCount } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  // const checkCartStatus = async (products) => {
  //   const status = await productCartStatus();
  //   const updatedAddedProducts = {};
  //   products.forEach((product) => {
  //     updatedAddedProducts[product._id] = status.includes(product._id);
  //   });
  //   setAddedProducts(updatedAddedProducts);
  // };

  // const handleOnAddToCart = async (e, id) => {
  //   const dataApi = await addToCart(e, id);
  //   if (dataApi.success) {
  //     fetchCartProductsCount();
  //     checkCartStatus(productList);
  //   }
  // };

  // useEffect(() => {
  //   setProductList(data);
  //   // checkCartStatus(data);
  // }, [data]);

  useEffect(() => {
    const currentPage = parseInt(new URLSearchParams(location.search).get("page")) || 1;
    setCurrentPage(currentPage);
  
    // Use locally paginated data.
    setProductList(data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE));
  }, [data, location.search]);
  

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`?page=${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,230px))] md:grid-cols-[repeat(auto-fit,minmax(200px,220px))]  gap-4 overflow-x-scroll scrollbar-none transition-all p-1">
        {loadingUi
          ? loadingList.map((e, i) => (
              <div
                key={i}
                className="w-full min-w-[170px] md:min-w-[230px] max-w-[230px] md:max-w-[270px] my-0.5 ml-0.5 rounded-md shadow-md"
              >
                <div className="bg-slate-200 h-56 md:h-60 p-4 min-w-[120px] md:min-w-[45px] flex justify-center items-center rounded-md animate-pulse"></div>
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
          : currentData.map((e, i) => (
              <Link
                key={i}
                to={"/product/" + e?._id}
                className="w-full min-w-[170px] md:min-w-[170px] max-w-[200px] md:max-w-[220px] my-0.5 ml-0.5 rounded-md shadow-md"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="bg-slate-200 h-52 md:h-56 p-4 min-w-[120px] md:min-w-[45px] flex justify-center items-center rounded-md">
                  <img
                    src={e.productPhoto[0].url}
                    className="object-scale-down h-52 md:h-56 hover:scale-110 transition-all mix-blend-multiply"
                    alt={e.productName}
                  />
                </div>
                <div className="px-4 pt-3 pb-2 grid">
                  <div className="flex justify-between">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                      {e?.productName}
                    </h2>

                    <div className="block text-right pt-1 w-16">
                      <p className="uppercase text-red-600 text-ellipsis line-clamp-1 text-xs pl-1 ">
                        {e?.size.join(" ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="capitalize text-slate-500 mb-1 -mt-1">
                      {e?.category}
                    </p>
                    <div className="block text-right -mt-1.5 w-16 ">
                      <p className="capitalize text-red-600 text-xs pl-1 line-clamp-1 text-ellipsis ">
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
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 mx-1 rounded-full ${
              page === currentPage
                ? "bg-red-500 text-white"
                : "bg-slate-200 text-black hover:bg-red-300 hover:text-white"
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  );
};

export default SearchProductList;

// import React, { useEffect, useState } from "react";
// import currencyFormat from "../helpers/currencyFormat";
// import { Link, useNavigate, useLocation } from "react-router-dom";

// const ITEMS_PER_PAGE = 15; // Number of items per page

// const SearchProductList = ({ loadingUi, data = [] }) => {
//   const loadingList = new Array(ITEMS_PER_PAGE).fill(null);  // For the loading placeholders
//   const [productList, setProductList] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const initialPage = parseInt(searchParams.get("page")) || 1;
//   const [currentPage, setCurrentPage] = useState(initialPage);

//   // Ensure `data` is always an array (fixes undefined issue)
//   const totalPages = data && data.length > 0 ? Math.ceil(data.length / ITEMS_PER_PAGE) : 1;

//   useEffect(() => {
//     setProductList(data || []);  // Ensure `data` is always an array
//   }, [data]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     navigate(`?page=${page}`);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const currentData = productList.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   return (
//     <>
//       <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,230px))] md:grid-cols-[repeat(auto-fit,minmax(200px,220px))] gap-4 overflow-x-scroll scrollbar-none transition-all p-1">
//         {loadingUi
//           ? loadingList.map((_, i) => (
//               <div
//                 key={i}
//                 className="w-full min-w-[170px] md:min-w-[230px] max-w-[230px] md:max-w-[270px] my-0.5 ml-0.5 rounded-md shadow-md"
//               >
//                 <div className="bg-slate-200 h-56 md:h-60 p-4 min-w-[120px] md:min-w-[45px] flex justify-center items-center rounded-md animate-pulse"></div>
//                 <div className="p-4 grid gap-3">
//                   <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200"></h2>
//                   <p className="capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200 py-2"></p>
//                   <div className="flex gap-3">
//                     <p className="text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
//                     <p className="text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
//                   </div>
//                   <button className="text-sm text-white px-3 rounded-full bg-slate-200 py-3.5 animate-pulse"></button>
//                 </div>
//               </div>
//             ))
//           : currentData.map((e, i) => (
//               <Link
//                 key={i}
//                 to={"/product/" + e?._id}
//                 className="w-full min-w-[170px] md:min-w-[170px] max-w-[200px] md:max-w-[220px] my-0.5 ml-0.5 rounded-md shadow-md"
//                 onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//               >
//                 <div className="bg-slate-200 h-56 md:h-60 p-4 min-w-[120px] md:min-w-[45px] flex justify-center items-center rounded-md">
//                   <img
//                     src={e.productPhoto[0].url}
//                     className="object-scale-down h-52 md:h-56 hover:scale-105 transition-all mix-blend-multiply"
//                     alt={e.productName}
//                   />
//                 </div>
//                 <div className="px-4 pt-3 pb-2 grid">
//                   <div className="flex justify-between">
//                     <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
//                       {e?.productName}
//                     </h2>

//                     <div className="flex pt-1 w-16 text-ellipsis line-clamp-1 justify-end">
//                       {e?.size.map((size, index) => (
//                         <p key={index} className="uppercase text-red-600 text-xs pl-1 ">
//                           {size}
//                         </p>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex justify-between">
//                     <p className="capitalize text-slate-500 mb-1 -mt-1">
//                       {e?.category}
//                     </p>
//                     <div className="flex -mt-1.5 w-16 line-clamp-1 text-ellipsis justify-end">
//                       {e?.color.map((color, index) => (
//                         <p key={index} className="capitalize text-red-600 text-xs pl-1 ">
//                           {color}
//                         </p>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex gap-3 mb-1">
//                     <p className="text-red-600 font-medium">
//                       {currencyFormat(e?.sellingPrice)}
//                     </p>
//                     <p className="text-slate-500 line-through">
//                       {currencyFormat(e?.mrp)}
//                     </p>
//                   </div>
//                   <button className="text-sm px-3 py-1.5 mb-1 rounded-full hover:bg-red-700 bg-red-600 text-white">
//                     View Product
//                   </button>
//                 </div>
//               </Link>
//             ))}
//       </div>
//       <div className="flex justify-center mt-4">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//           <button
//             key={page}
//             className={`px-3 py-1 mx-1 rounded-full ${
//               page === currentPage
//                 ? "bg-red-500 text-white"
//                 : "bg-slate-200 text-black hover:bg-red-300 hover:text-white"
//             }`}
//             onClick={() => handlePageChange(page)}
//           >
//             {page}
//           </button>
//         ))}
//       </div>
//     </>
//   );
// };

// export default SearchProductList;
