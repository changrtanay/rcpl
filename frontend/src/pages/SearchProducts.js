// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import summaryApi from "../common";
// import SearchProductList from "../components/SearchProductList";

// const SearchProduct = () => {
//   const query = useLocation();
//   const [data, setData] = useState([]);
//   const [loadingUi, setLoadingUi] = useState(false);

//   const fetchProduct = async () => {
//     setLoadingUi(true);
//       const dataResponse = await fetch(summaryApi.searchProduct.url + query.search);
//       const dataApi = await dataResponse.json();
//       setData(dataApi.data);
//       setLoadingUi(false);
//   };

//   useEffect(() => {
//     fetchProduct();
//   }, [query.search]);

//   return (
//     <div className="container mx-auto p-4">

//       <p className="text-lg font-semibold my-3">
//         Search Results : {data.length}
//       </p>

//       {data.length === 0 && !loadingUi && (
//         <p className="bg-white text-lg text-center p-4">No Data Found....</p>
//       )}

//       {data.length !== 0 && (
//         <SearchProductList loadingUi={loadingUi} data={data} />
//       )}
//     </div>
//   );
// };

// export default SearchProduct;

// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import summaryApi from "../common";
// import SearchProductList from "../components/SearchProductList";
// import categoryList from "../helpers/categoryList";

// const SearchProduct = () => {
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const [data, setData] = useState([]);
//   const [loadingUi, setLoadingUi] = useState(false);

//   const fetchProduct = async () => {
//     setLoadingUi(true);
//     const dataResponse = await fetch(
//       `${summaryApi.searchProduct.url}?${query.toString()}`
//     );
//     const dataApi = await dataResponse.json();
//     setData(dataApi.data);
//     setLoadingUi(false);
//   };

//   useEffect(() => {
//     fetchProduct();
//   }, [location.search]);

//   const [selectedCategory, setSelectedCategory] = useState({});
//   const [newSelectedCategory, setNewSelectedCategory] = useState([]);

//   const [sortBy, setSortBy] = useState("");

//   const fetchData = async () => {
//     setLoadingUi(true);
//     const dataResponse = await fetch(summaryApi.filterProducts.url, {
//       method: summaryApi.filterProducts.method,
//       headers: {
//         "content-type": "application/json",
//       },
//       body: JSON.stringify({
//         category: newSelectedCategory,
//       }),
//     });

//     const dataApi = await dataResponse.json();
//     setData(dataApi?.data || []);
//     setLoadingUi(false);
//   };

//   const handleOnCheck = (e) => {
//     const { value, checked } = e.target;
//     setSelectedCategory((prev) => ({
//       ...prev,
//       [value]: checked,
//     }));
//   };

//   useEffect(() => {
//     fetchData();
//   }, [newSelectedCategory]);

//   useEffect(() => {
//     const updatedSelectedCategory = Object.keys(selectedCategory).filter(
//       (key) => selectedCategory[key]
//     );

//     setNewSelectedCategory(updatedSelectedCategory);
//   }, [selectedCategory]);

//   const handleOnChangeSortBy = (e) => {
//     const { value } = e.target;
//     setSortBy(value);
//     setData((prevData) => {
//       return [...prevData].sort((a, b) =>
//         value === "asc"
//           ? a.sellingPrice - b.sellingPrice
//           : b.sellingPrice - a.sellingPrice
//       );
//     });
//   };

//   return (
//     <div className="container mx-auto py-4 md:px-4 px-2">
//       {/***desktop version */}
//       <div className="grid md:grid-cols-[215px,1fr] grid-cols-[105px,1fr] items-baseline md:items-start">
//         {/***left side */}
//         {/* min-h-[calc(100vh-380px)] h-fit md:h-full md:max-h-[calc(100vh-120px)] */}
//         <div className="bg-white p-3 md:px-3.5 px-1 min-h-[calc(100vh-120px)] overflow-y-scroll scrollbar-none rounded-2xl shadow-md ">
//           {/**sort by */}
//           <div className="">
//             <h3 className="text-base uppercase pl-4 md:pl-0 font-medium text-slate-500 border-b pb-1 border-slate-300">
//               Sort by
//             </h3>

//             <form className="text-sm flex flex-col gap-2 py-2">
//               <div className="flex items-center md:gap-3 gap-2">
//                 <input
//                   type="radio"
//                   name="sortBy"
//                   checked={sortBy === "asc"}
//                   onChange={handleOnChangeSortBy}
//                   value={"asc"}
//                 />
//                 <label>Price - Low to High</label>
//               </div>

//               <div className="flex items-center md:gap-3 gap-2 py-2 md:py-0">
//                 <input
//                   type="radio"
//                   name="sortBy"
//                   checked={sortBy === "dsc"}
//                   onChange={handleOnChangeSortBy}
//                   value={"dsc"}
//                 />
//                 <label>Price - High to Low</label>
//               </div>
//             </form>
//           </div>

//           {/**filter by */}
//           <div className="">
//             <h3 className="text-base uppercase pl-2 md:pl-0 font-medium text-slate-500 border-b pt-2 pb-1 border-slate-300">
//               Category
//             </h3>

//             <form className="text-sm flex flex-col gap-2 py-2">
//               {categoryList.map((categoryName, index) => {
//                 return (
//                   <div
//                     className="flex items-center md:gap-3 gap-2 pb-1 md:pb-0"
//                     key={index}
//                   >
//                     <input
//                       type="checkbox"
//                       name={"category"}
//                       checked={selectedCategory[categoryName?.value]}
//                       value={categoryName?.value}
//                       id={categoryName?.value}
//                       onChange={handleOnCheck}
//                     />
//                     <label htmlFor={categoryName?.value}>
//                       {categoryName?.label}
//                     </label>
//                   </div>
//                 );
//               })}
//             </form>
//           </div>
//         </div>

//         {/***right side ( product ) */}
//         <div className="md:ml-6 ml-2 p-4 pl-1 md:pl-2  rounded-xl shadow-md bg-white">
//           <p className="font-medium pl-2 text-slate-800 text-lg mb-2">
//             Search Results : {data.length}
//           </p>

//           <div className="overflow-y-scroll max-h-[calc(100vh-156px)] ">
//             {loadingUi && <p>Loading...</p>} {/* Display loading indicator */}
//             {!loadingUi && data.length === 0 && <p>No Products Found </p>}
//             {!loadingUi && data.length !== 0 && (
//               <SearchProductList data={data} loadingUi={loadingUi} />
//             )}
//           </div>
//           {/* {!loadingUi && data.length === 0 && (
//           <p className="bg-white text-lg text-center p-4">No Data Found....</p>
//         )}

//         {data.length !== 0 && (
//           <SearchProductList loadingUi={loadingUi} data={data} />
//         )} */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchProduct;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import summaryApi from "../common";
import SearchProductList from "../components/SearchProductList";
import categoryList from "../helpers/categoryList";

const SearchProduct = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [data, setData] = useState([]);
  const [loadingUi, setLoadingUi] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [sortBy, setSortBy] = useState("");

  const fetchProducts = async () => {
    setLoadingUi(true);
    const searchQuery = query.get("q");
    const selectedCategories = Object.keys(selectedCategory).filter(
      (key) => selectedCategory[key]
    );
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append("q", searchQuery);
    if (selectedCategories.length > 0)
      queryParams.append("category", selectedCategories.join(","));

    const dataResponse = await fetch(
      `${summaryApi.searchProduct.url}?${queryParams.toString()}`
    );
    const dataApi = await dataResponse.json();
    setData(dataApi.data);
    setLoadingUi(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [location.search, selectedCategory]);

  const handleOnCheck = (e) => {
    const { value, checked } = e.target;
    setSelectedCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);
    setData((prevData) => {
      return [...prevData].sort((a, b) =>
        value === "asc"
          ? a.sellingPrice - b.sellingPrice
          : b.sellingPrice - a.sellingPrice
      );
    });
  };

  return (
    <div className="container mx-auto py-4 sm:px-4 px-2">
      <div className="grid sm:grid-cols-[215px,1fr] grid-cols-[105px,1fr] items-baseline sm:items-start">
        <div className="bg-white p-3 sm:px-3.5 px-1 min-h-[calc(100vh-120px)] overflow-y-scroll scrollbar-none rounded-2xl shadow-md">
          <div className="">
            <h3 className="text-base uppercase pl-4 sm:pl-0 font-medium text-slate-500 border-b pb-1 border-slate-300">
              Sort by
            </h3>
            <form className="text-sm flex flex-col gap-2 py-2">
              <div className="flex items-center sm:gap-3 gap-2">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === "asc"}
                  onChange={handleOnChangeSortBy}
                  value={"asc"}
                />
                <label>Price - Low to High</label>
              </div>
              <div className="flex items-center sm:gap-3 gap-2 py-2 sm:py-0">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === "dsc"}
                  onChange={handleOnChangeSortBy}
                  value={"dsc"}
                />
                <label>Price - High to Low</label>
              </div>
            </form>
          </div>
          <div className="">
            <h3 className="text-base uppercase pl-2 sm:pl-0 font-medium text-slate-500 border-b pt-2 pb-1 border-slate-300">
              Category
            </h3>
            <form className="text-sm flex flex-col gap-2 py-2">
              {categoryList.map((categoryName, index) => {
                return (
                  <div
                    className="flex items-center sm:gap-3 gap-2 pb-1 sm:pb-0"
                    key={index}
                  >
                    <input
                      type="checkbox"
                      name={"category"}
                      checked={selectedCategory[categoryName?.value]}
                      value={categoryName?.value}
                      id={categoryName?.value}
                      onChange={handleOnCheck}
                    />
                    <label htmlFor={categoryName?.value}>
                      {categoryName?.label}
                    </label>
                  </div>
                );
              })}
            </form>
          </div>
        </div>
        <div className="sm:ml-6 ml-2 p-4 pl-1 sm:pl-2 rounded-xl shadow-md bg-white">
          <div className="flex gap-1.5">
            <p className="font-medium pl-2 text-slate-800 text-lg mb-2">
              Search Results:
            </p>
            <p className="pt-0.5 font-medium">
            {loadingUi ? "" : data.length}
            </p>
          </div>
          <div className="overflow-y-scroll max-h-[calc(100vh-156px)] ">
            {loadingUi && <p>Loading...</p>}
            {!loadingUi && data.length === 0 && <p>No Products Found </p>}
            {!loadingUi && data.length !== 0 && (
              <SearchProductList data={data} loadingUi={loadingUi} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProduct;
