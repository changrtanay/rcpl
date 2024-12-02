import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import summaryApi from "../common";
import { toast } from "react-toastify";
import categoryList from "../helpers/categoryList";
import sizeList from "../helpers/sizeList";
import { MdCloudUpload } from "react-icons/md";
import uploadPhotoToCloud from "../helpers/uploadPhotoToCloud";
import FullPhoto from "./FullPhoto";
import { MdDelete } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import samplevideo from "../assets/samplevideo.jpg";

const UpdateProduct = ({ product, handleOnClose, refresh }) => {
  const [isFullPhotoVisible, setIsFullPhotoVisible] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [newColor, setNewColor] = useState("");
  const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
  const [data, setData] = useState({
    ...product,
    productName: product.productName || "",
    brand: product.brand || "",
    category: product.category || "",
    productPhoto: product.productPhoto || [],
    description: product.description || "",
    mrp: product.mrp || "",
    sellingPrice: product.sellingPrice || "",
    size: product.size || [],
    color: product.color || [],
    quantity: product.quantity || [],
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle size selection
  const handleOnSelect = (e) => {
    const { value } = e.target;

    setData((prevData) => {
      let updatedSizes;
      if (prevData.size.includes(value)) {
        // If the size is already selected, remove it
        updatedSizes = prevData.size.filter((size) => size !== value);
      } else {
        // If the size is not selected, add it
        updatedSizes = [...prevData.size, value];
      }

      // Sort sizes based on the predefined size order
      updatedSizes.sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));

      // Update quantity: add or remove sizes
      let updatedQuantity = [...prevData.quantity];
      if (prevData.size.includes(value)) {
        // Remove corresponding size from quantity
        updatedQuantity = updatedQuantity.filter((item) => item.size !== value);
      } else {
        // Add new size to quantity with all current colors
        const newQuantityEntry = {
          size: value,
          colors: prevData.color.map((color) => ({
            color,
            quantity: 0, // default initial quantity
          })),
        };
        updatedQuantity.push(newQuantityEntry);
      }

      return {
        ...prevData,
        size: updatedSizes, // Update the size array
        quantity: updatedQuantity, // Update the quantity
      };
    });
  };

  // Handle adding a new color
  const handleAddColor = (e) => {
    e.preventDefault();
    if (newColor.trim()) {
      setData((prevData) => {
        // Add new color to all sizes in quantity
        const updatedQuantity = prevData.quantity.map((item) => ({
          ...item,
          colors: [...item.colors, { color: newColor, quantity: 0 }], // Add the new color with default quantity
        }));

        return {
          ...prevData,
          color: [...prevData.color, newColor], // Add new color to color array
          quantity: updatedQuantity, // Update the quantity
        };
      });
      setNewColor(""); // Clear the input after adding
    }
  };

  // Handle removing a color
  const handleRemoveColor = (indexToRemove) => {
    const colorToRemove = data.color[indexToRemove];
    setData((prevData) => {
      // Remove color from all sizes in quantity
      const updatedQuantity = prevData.quantity.map((item) => ({
        ...item,
        colors: item.colors.filter(
          (colorItem) => colorItem.color !== colorToRemove
        ),
      }));

      return {
        ...prevData,
        color: prevData.color.filter((_, index) => index !== indexToRemove),
        quantity: updatedQuantity, // Update the quantity
      };
    });
  };

  const handleQuantityChange = (e, size, color) => {
    const newQuantity = Number(e.target.value);

    setData((prevData) => {
      const updatedQuantity = prevData.quantity.map((item) => {
        if (item.size === size) {
          const updatedColors = item.colors.map((colorItem) => {
            if (colorItem.color === color) {
              return { ...colorItem, quantity: newQuantity };
            }
            return colorItem;
          });

          return {
            ...item,
            colors: updatedColors,
          };
        }
        return item;
      });

      return {
        ...prevData,
        quantity: updatedQuantity,
      };
    });
  };

  const handleOnPhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      return;
    }

    // Function to handle upload to cloud
    const uploadPromises = files.map((file) => {
      const isImage = file.type.startsWith("image");
      const isVideo = file.type.startsWith("video");

      // Upload the file to the cloud and handle image/video distinction
      return uploadPhotoToCloud(file).then((result) => ({
        url: result.url,
        type: isImage ? "image" : isVideo ? "video" : "unknown",
      }));
    });

    const uploadResults = await Promise.all(uploadPromises);

    // Append new media (photos/videos) to the existing productPhoto state
    setData((prevData) => ({
      ...prevData,
      productPhoto: [...prevData.productPhoto, ...uploadResults], // UploadResults now contains both URL and media type
    }));
  };

  const handleOnRemovePhoto = async (i) => {
    const newProductPhoto = [...data.productPhoto];
    newProductPhoto.splice(i, 1);

    setData((prevData) => ({
      ...prevData,
      productPhoto: [...newProductPhoto],
    }));
  };

  const handleOnSave = async (e) => {
    e.preventDefault();

    const dataResponse = await fetch(summaryApi.updateProduct.url, {
      method: summaryApi.updateProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      handleOnClose();
      refresh();
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  return (
    <div className="fixed w-full h-full top-0 bottom-0 left-0 right-0 flex z-10 justify-center items-center bg-slate-200 bg-opacity-50">
      <div className="bg-white pl-4 pr-2.5 pb-4 pt-3 rounded shadow-md max-w-2xl w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium pt-1">Update Product</h1>
          <button
            className="text-xl pr-0.5 hover:text-red-600 transition-all"
            onClick={handleOnClose}
          >
            <IoClose />
          </button>
        </div>

        <div className="pr-0.5 mt-2 mr-0.5 max-h-[80%] overflow-hidden">
          <form
            className="pt-2 pr-4 flex flex-col gap-2 overflow-y-auto max-h-[70vh]"
            onSubmit={handleOnSave}
          >
            <div>
              <label htmlFor="productName" className="">
                Product:
              </label>
              <input
                type="text"
                id="productName"
                value={data.productName}
                name="productName"
                onChange={handleOnChange}
                placeholder="Enter Product Name"
                className="w-full h-full border rounded bg-slate-100 p-2"
                required
              ></input>
            </div>

            <div>
              <label htmlFor="brand" className="">
                Brand:
              </label>
              <input
                type="text"
                id="brand"
                value={data.brand}
                name="brand"
                onChange={handleOnChange}
                placeholder="Enter Brand Name"
                className="w-full h-full border rounded bg-slate-100 p-2"
                required
              ></input>
            </div>

            <div className="flex flex-col">
              <label htmlFor="category" className="">
                Category:
              </label>
              <select
                required
                value={data.category}
                name="category"
                onChange={handleOnChange}
                className="p-2 bg-slate-100 border rounded cursor-pointer"
              >
                <option value="" className="text-gray-400">
                  Select Product Category
                </option>
                {categoryList.map((e, i) => (
                  <option
                    className="text-black"
                    key={i + e.value}
                    value={e.value}
                  >
                    {e.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2">
              <label htmlFor="uploadProductPhoto">
                <div className="bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
                  <div className="flex items-center flex-col">
                    <span className="text-slate-500 text-4xl">
                      <MdCloudUpload />
                    </span>
                    <p className="text-sm text-slate-400">
                      Upload Product Photo
                    </p>
                    <input
                      type="file"
                      id="uploadProductPhoto"
                      multiple
                      className="hidden"
                      onChange={handleOnPhotoUpload}
                    />
                  </div>
                </div>
              </label>
            </div>

            <div>
              {data?.productPhoto.length > 0 && (
                <div className="flex item-center gap-2">
                  {data.productPhoto.map((media, i) => (
                    <div className="relative group" key={i}>
                      {media.type === "image" ? (
                        <img
                          src={media.url}
                          alt={`media-${i}`}
                          width={80}
                          height={80}
                          className="bg-slate-100 border overflow-hidden cursor-pointer"
                          onClick={() => {
                            setIsFullPhotoVisible(true);
                            setPhotoUrl(media.url);
                          }}
                        />
                      ) : media.type === "video" ? (
                        <div className="">
                          <img
                            src={samplevideo}
                            alt={`media-${i}`}
                            width={80}
                            height={80}
                            className="bg-slate-100 border overflow-hidden cursor-pointer"
                            onClick={() => {
                              setIsFullPhotoVisible(true);
                              setPhotoUrl(media.url);
                            }}
                          />
                        </div>
                      ) : null}

                      <button
                        className="absolute bg-red-600 text-white p-1 bottom-0 right-0 rounded-full hidden group-hover:block"
                        onClick={() => handleOnRemovePhoto(i)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="mrp" className="">
                MRP:
              </label>
              <input
                type="number"
                id="mrp"
                placeholder="Enter MRP"
                value={data.mrp}
                name="mrp"
                onChange={handleOnChange}
                className="w-full h-full border rounded bg-slate-100 p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="sellingPrice" className="">
                Selling Price:
              </label>
              <input
                type="number"
                id="sellingPrice"
                placeholder="Enter Selling Price"
                value={data.sellingPrice}
                name="sellingPrice"
                onChange={handleOnChange}
                className="w-full h-full border rounded bg-slate-100 p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="color" className="">
                Colors:
              </label>
              <div className="flex flex-row items-center gap-2">
                <input
                  type="text"
                  className="w-full h-10 border rounded bg-slate-100 p-2"
                  placeholder="Enter Product Colors"
                  onChange={(e) => setNewColor(e.target.value)}
                  value={newColor} // Bind the input field to the newColor state
                />
                <button
                  className="px-5 py-1 w-36 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
                  onClick={handleAddColor}
                >
                  Add Color
                </button>
              </div>

              {/* Display the color list with cross icons */}
              <div className="flex flex-wrap gap-2">
                {data.color.map((color, index) => (
                  <span
                    key={index}
                    className="w-auto h-8 px-4 mt-1.5 flex items-center border border-red-600 bg-red-500 text-white relative rounded-sm"
                  >
                    <span className="mr-2 capitalize">{color}</span>
                    <RxCross2
                      className="h-4 w-4 p-0.5 cursor-pointer absolute right-1 top-1/2 transform -translate-y-1/2 bg-red-400 hover:bg-red-600 rounded-full"
                      onClick={() => handleRemoveColor(index)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="size" className="">
                Sizes:
              </label>
              <div className="flex flex-row gap-2">
                {sizeList.map((e, i) => (
                  <label
                    key={i + e.value}
                    className="cursor-pointer flex items-center"
                  >
                    <input
                      type="checkbox"
                      name="size"
                      value={e.value}
                      onChange={handleOnSelect}
                      checked={data.size.includes(e.value)}
                      className="hidden"
                    />
                    <span
                      className={`w-14 h-8 flex border items-center relative ${
                        data.size.includes(e.value)
                          ? "border-red-600 bg-red-500 text-white justify-center gap-"
                          : "bg-slate-100 justify-center"
                      }`}
                    >
                      {data.size.includes(e.value) ? (
                        <div className="-ml-2 ">
                          {e.label}
                          <RxCross2 className="h-4 w-4 p-0.5 absolute right-0.5 bottom-1.5 mt-0.5 rounded-full bg-red-400 hover:bg-red-600" />
                        </div>
                      ) : (
                        <div className="">{e.label}</div>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-0.5">
              <label htmlFor="y" className="">
                Quantity:
              </label>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Size</th>
                    <th className="border p-2 text-left">Color</th>
                    <th className="border p-2 text-left">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {data.quantity.map((item) =>
                    item.colors.map((colorItem) => (
                      <tr key={`${item.size}-${colorItem.color}`}>
                        <td className="uppercase border p-2">{item.size}</td>
                        <td className="capitalize border p-2">
                          {colorItem.color}
                        </td>
                        <td className="border p-2">
                          <input
                            type="number"
                            placeholder="Enter Quantity"
                            value={colorItem.quantity || ""}
                            name={`quantity-${item.size}-${colorItem.color}`}
                            onChange={(e) =>
                              handleQuantityChange(
                                e,
                                item.size,
                                colorItem.color
                              )
                            }
                            className="w-full h-10 border rounded bg-slate-100 p-2"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <label htmlFor="description" className="">
                Description:
              </label>
              <textarea
                className="w-full h-40 border rounded bg-slate-100 p-2 resize-none overflow-hidden overflow-y-scroll"
                placeholder="Enter Product Description"
                rows={3}
                onChange={handleOnChange}
                name="description"
                value={data.description}
                required
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button className="flex justify-center my-4 px-5 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {isFullPhotoVisible && (
        <FullPhoto
          handleOnClose={() => setIsFullPhotoVisible(false)}
          photoUrl={photoUrl}
        />
      )}
    </div>
  );
};

export default UpdateProduct;