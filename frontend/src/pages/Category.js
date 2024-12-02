// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import categoryList from "../helpers/categoryList";
// import SearchProductList from "../components/SearchProductList";
// import summaryApi from "../common";

// const Category = () => {
//   const [data, setData] = useState([]);
//   const navigate = useNavigate();
//   const [loadingUi, setLoadingUi] = useState(false);
//   const location = useLocation();
//   const urlCategory = new URLSearchParams(location.search);
//   const urlCategoryList = urlCategory.getAll("category");
//   console.log(location)
//   console.log(location.search)
//   console.log(urlCategory)
//   console.log(urlCategoryList)

//   const urlCategoryObject = {};
//   urlCategoryList.forEach((el) => {
//     urlCategoryObject[el] = true;
//   });

//   const [selectedCategory, setSelectedCategory] = useState(urlCategoryObject);
//   const [newSelectedCategory, setNewSelectedCategory] = useState([]);

//   const [sortBy, setSortBy] = useState("");

//   const fetchData = async () => {
//     setLoadingUi(true); // Start loading
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
//     setLoadingUi(false); // End loading
//   };

//   const handleOnCheck = (e) => {
//     const { value, checked } = e.target;

//     setSelectedCategory((prev) => {
//       return {
//         ...prev,
//         [value]: checked,
//       };
//     });
//   };

//   useEffect(() => {
//     fetchData();
//   }, [newSelectedCategory]);

//   useEffect(() => {
//     const updatedSelectedCategory = Object.keys(selectedCategory)
//       .map((categoryKeyName) => {
//         if (selectedCategory[categoryKeyName]) {
//           return categoryKeyName;
//         }
//         return null;
//       })
//       .filter((el) => el);

//     setNewSelectedCategory(updatedSelectedCategory);

//     //format for url change when change on the checkbox
//     const urlFormat = updatedSelectedCategory.map((el, index) => {
//       if (updatedSelectedCategory.length - 1 === index) {
//         return `category=${el}`;
//       }
//       return `category=${el}&&`;
//     });

//     navigate("/category?" + urlFormat.join(""));
//   }, [selectedCategory]);

//   const handleOnChangeSortBy = (e) => {
//     const { value } = e.target;
//     setSortBy(value);
//     if (value === "asc") {
//       setData((prev) => prev.sort((a, b) => a.sellingPrice - b.sellingPrice));
//     }
//     if (value === "dsc") {
//       setData((prev) => prev.sort((a, b) => b.sellingPrice - a.sellingPrice));
//     }
//   };

//   // useEffect(() => {}, [sortBy]);

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
//                   id="asc"
//                   checked={sortBy === "asc"}
//                   onChange={handleOnChangeSortBy}
//                   value={"asc"}
//                 />
//                 <label htmlFor="asc" className="cursor-pointer">Price - Low to High</label>
//               </div>

//               <div className="flex items-center md:gap-3 gap-2 py-2 md:py-0">
//                 <input
//                   type="radio"
//                   name="sortBy"
//                   id="dsc"
//                   checked={sortBy === "dsc"}
//                   onChange={handleOnChangeSortBy}
//                   value={"dsc"}
//                 />
//                 <label htmlFor="dsc" className="cursor-pointer">Price - High to Low</label>
//               </div>
//             </form>
//           </div>

//           {/**filter by */}
//           <div className="">
//             <h3 className="text-base uppercase pl-2 md:pl-0 font-medium text-slate-500 border-b pt-2 pb-1 border-slate-300">
//               Category
//             </h3>

//             <form className="text-sm flex flex-col gap-2 py-2 ">
//               {categoryList.map((categoryName, index) => {
//                 return (
//                   <div className="flex items-center md:gap-3 gap-2 pb-1 md:pb-0" key={index}>
//                     <input
//                       type="checkbox"
//                       name={"category"}
//                       checked={selectedCategory[categoryName?.value]}
//                       value={categoryName?.value}
//                       id={categoryName?.value}
//                       onChange={handleOnCheck}
//                     />
//                     <label htmlFor={categoryName?.value} className="cursor-pointer">
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

//           <div className="max-h-[calc(100vh-156px)] overflow-y-scroll ">
//             {loadingUi && <p>Loading...</p>} {/*  Display loading indicator */}
//             {!loadingUi && data.length === 0 && <p>No Products Found </p>}
//             {data.length !== 0 && (
//               <SearchProductList data={data} loadingUi={loadingUi} />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Category;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import categoryList from "../helpers/categoryList";
import SearchProductList from "../components/SearchProductList";
import summaryApi from "../common";

const Category = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loadingUi, setLoadingUi] = useState(false);
  const location = useLocation();

  // Get the selected categories from the URL
  const urlCategory = new URLSearchParams(location.search);
  const urlCategoryList = urlCategory.getAll("category");

  // Convert category list from URL to an object for easier handling
  const urlCategoryObject = {};
  urlCategoryList.forEach((el) => {
    urlCategoryObject[el] = true;
  });

  const [selectedCategory, setSelectedCategory] = useState(urlCategoryObject);
  const [sortBy, setSortBy] = useState("");

  // Fetch filtered data from API
  const fetchData = async () => {
    setLoadingUi(true); // Start loading
    const selectedCategoryKeys = Object.keys(selectedCategory).filter(
      (category) => selectedCategory[category]
    );

    const dataResponse = await fetch(summaryApi.filterProducts.url, {
      method: summaryApi.filterProducts.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        category: selectedCategoryKeys, // Send selected categories
      }),
    });

    const dataApi = await dataResponse.json();
    setData(dataApi?.data || []);
    setLoadingUi(false); // End loading
  };

  // Handle checkbox selection for categories
  const handleOnCheck = (e) => {
    const { value, checked } = e.target;
    setSelectedCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  // Update the URL and fetch data when selectedCategory changes
  useEffect(() => {
    const updatedSelectedCategory = Object.keys(selectedCategory).filter(
      (key) => selectedCategory[key]
    );

    // Update the URL query string
    const urlParams = updatedSelectedCategory
      .map((el) => `category=${el}`)
      .join("&");

    // Use replace option to avoid adding new history entry
    navigate("/category?" + urlParams, { replace: true });

    // Fetch data based on the updated selected categories
    fetchData();
  }, [selectedCategory]);

  // Handle sorting logic
  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);
    setData((prev) =>
      [...prev].sort((a, b) =>
        value === "asc"
          ? a.sellingPrice - b.sellingPrice
          : b.sellingPrice - a.sellingPrice
      )
    );
  };

  return (
    <div className="container mx-auto py-4 sm:px-4 px-2">
      {/***desktop version */}
      <div className="grid sm:grid-cols-[215px,1fr] grid-cols-[105px,1fr] items-baseline sm:items-start">
        {/***left side */}
        <div className="bg-white p-3 sm:px-3.5 px-1 min-h-[calc(100vh-120px)] overflow-y-scroll scrollbar-none rounded-2xl shadow-sm ">
          {/**sort by */}
          <div>
            <h3 className="text-base uppercase pl-4 sm:pl-0 font-medium text-slate-500 border-b pb-1 border-slate-300">
              Sort by
            </h3>

            <form className="text-sm flex flex-col gap-2 py-2">
              <div className="flex items-center sm:gap-3 gap-2">
                <input
                  type="radio"
                  name="sortBy"
                  id="asc"
                  checked={sortBy === "asc"}
                  onChange={handleOnChangeSortBy}
                  value={"asc"}
                />
                <label htmlFor="asc" className="cursor-pointer">
                  Price - Low to High
                </label>
              </div>

              <div className="flex items-center sm:gap-3 gap-2 py-2 sm:py-0">
                <input
                  type="radio"
                  name="sortBy"
                  id="dsc"
                  checked={sortBy === "dsc"}
                  onChange={handleOnChangeSortBy}
                  value={"dsc"}
                />
                <label htmlFor="dsc" className="cursor-pointer">
                  Price - High to Low
                </label>
              </div>
            </form>
          </div>

          {/**filter by */}
          <div>
            <h3 className="text-base uppercase pl-2 sm:pl-0 font-medium text-slate-500 border-b pt-2 pb-1 border-slate-300">
              Category
            </h3>

            <form className="text-sm flex flex-col gap-2 py-2 ">
              {categoryList.map((categoryName, index) => (
                <div
                  className="flex items-center sm:gap-3 gap-2 pb-1 sm:pb-0"
                  key={index}
                >
                  <input
                    type="checkbox"
                    name={"category"}
                    checked={selectedCategory[categoryName?.value] || false}
                    value={categoryName?.value}
                    id={categoryName?.value}
                    onChange={handleOnCheck}
                  />
                  <label
                    htmlFor={categoryName?.value}
                    className="cursor-pointer"
                  >
                    {categoryName?.label}
                  </label>
                </div>
              ))}
            </form>
          </div>
        </div>

        {/***right side ( product ) */}
        <div className="sm:ml-6 ml-2 p-4 pl-1 sm:pl-2 rounded-xl shadow-md bg-white">
          <div className="flex gap-1.5">
            <p className="font-medium pl-2 text-slate-800 text-lg mb-2">
              Search Results :
            </p>
            <p className="pt-0.5 font-medium">{loadingUi ? "" : data.length}</p>
          </div>

          <div className="max-h-[calc(100vh-156px)] overflow-y-scroll ">
            {loadingUi && <p>Loading...</p>} {/*  Display loading indicator */}
            {!loadingUi && data.length === 0 && <p>No Products Found</p>}
            {data.length !== 0 && (
              <SearchProductList data={data} loadingUi={loadingUi} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
