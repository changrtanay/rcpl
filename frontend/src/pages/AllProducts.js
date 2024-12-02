import React, { useEffect, useState } from "react";
import AddProduct from "../components/AddProduct";
import summaryApi from "../common";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import UpdateProduct from "../components/UpdateProduct";
import currencyFormat from "../helpers/currencyFormat";
import { MdRefresh } from "react-icons/md";

const AllProducts = () => {
  const [addProductPanel, setAddProductPanel] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [updateProductPanel, setUpdateProductPanel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // New state for selected product

  let fetchAllProducts = async () => {
    const dataResponse = await fetch(summaryApi.allProducts.url, {
      method: summaryApi.allProducts.method,
      credentials: "include",
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      setAllProducts(dataApi.data);
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="">
      <div className="bg-white px-3 py-2 flex justify-between items-center">
        <h2 className="font-bold text-lg">All Products</h2>
        <div className="flex items-center gap-5">
          <button className="" onClick={() => fetchAllProducts()}>
            <MdRefresh className="text-3xl text-red-600 hover:bg-gray-200 hover:text-red-500 transition-all rounded-full p-0.5" />
          </button>
          <button
            className="mr-0.5 py-1 px-3 rounded-full bg-white font-semibold text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all"
            onClick={() => setAddProductPanel(true)}
          >
            Add New Product
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-5 py-3 px-2.5 rounded-md bg-white my-3">
        {allProducts.map((e, i) => {
          return (
            <div className="bg-white pt-2 px-3 pb-2 rounded shadow-md border" key={i}>
              <div className="relative group">
                <div className="h-32 w-36 flex justify-center items-center mb-1">
                  <img
                    src={e?.productPhoto[0]?.url}
                    width={120}
                    height={120}
                    className="object-scale-down h-full mx-auto "
                  />
                </div>
                <button
                  className="p-1 hover:bg-green-200 hover:rounded-full absolute bottom-0 right-0 hidden group-hover:block"
                  onClick={() => {
                    setSelectedProduct(e); // Set the selected product
                    setUpdateProductPanel(true);
                  }}
                >
                  <MdEdit />
                </button>
              </div>
              <h1 className="text-ellipsis line-clamp-2 w-36 h-12 mb-1 pt-1">{e?.productName}</h1>
              <p className="font-semibold">{currencyFormat(e?.sellingPrice)}</p>
            </div>
          );
        })}
      </div>


      {addProductPanel && (
        <AddProduct
          handleOnClose={() => setAddProductPanel(false)}
          refresh={fetchAllProducts}
        />
      )}

      {updateProductPanel && selectedProduct && (
        <UpdateProduct
          product={selectedProduct}
          handleOnClose={() => setUpdateProductPanel(false)}
          refresh={fetchAllProducts}
        />
      )}
    </div>
  );
};

export default AllProducts;
