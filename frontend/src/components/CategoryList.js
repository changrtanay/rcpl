import React, { useEffect, useState } from "react";
import summaryApi from "../common";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [loadingUi, setLoadingUi] = useState(false);

  const loadingList = new Array(4).fill(null);

  let fetchCategoryList = async () => {
    setLoadingUi(true);
    const dataResponse = await fetch(summaryApi.categoryProductOne.url, {
      method: summaryApi.categoryProductOne.method,
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      setLoadingUi(false);
      setCategoryList(dataApi.data);
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  return (
    <div className="container mx-auto mb-4">
      <div className="flex items-center gap-4 justify-between overflow-scroll scrollbar-none">
        {loadingUi
          ? loadingList.map((e, i) => {
              return (
              <div>
                <div
                  className="min-w-[64px] min-h-[64px] md:min-w-[80px] md:min-h-[80px] lg:min-w-[96px] lg:min-h-[96px] rounded-full overflow-hidden bg-slate-200 animate-pulse"
                  key={"loadingUi" + i}
                ></div>
                <p className="bg-slate-200 p-2 rounded-full mt-2 animate-pulse"></p>
              </div>
              );
            })
          : categoryList.map((e, i) => {
              return (
                <Link
                  to={"/category?category=" + e?.category}
                  className="cursor-pointer"
                  key={e?.category}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-2 hover:p-1.5 bg-slate-200 flex items-center justify-center">
                    <img
                      src={e?.productPhoto[0]?.url}
                      alt={e?.category}
                      className="h-full object-scale-down scale-125 mix-blend-multiply transition-all"
                    />
                  </div>
                  <p className="text-center text-sm md:text-base capitalize">
                    {e?.category}
                  </p>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default CategoryList;
