import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import summaryApi from "../common";
import currencyFormat from "../helpers/currencyFormat";
import HorizontalProductList from "../components/HorizontalProductList";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import productCartStatus from "../helpers/productCartStatus"; // Import a helper to check cart status
import { toast } from "react-toastify";
import { FaCirclePlay } from "react-icons/fa6";

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brand: "",
    category: "",
    productPhoto: [],
    description: "",
    mrp: "",
    sellingPrice: "",
    size: [],
    color: [],
    quantity: [],
  });

  const [addedProducts, setAddedProducts] = useState(false);
  const params = useParams();
  const [loadingUi, setLoadingUi] = useState(true);
  const productPhotoListLoading = new Array(3).fill(null);
  const [activePhoto, setActivePhoto] = useState("");
  const [isVideo, setIsVideo] = useState(false);

  const [photoZoomCoordinates, setZoomPhotoCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [photoZoom, setPhotoZoom] = useState(false);

  const { fetchCartProductsCount } = useContext(Context);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    setLoadingUi(true);
    const dataResponse = await fetch(summaryApi.productDetails.url, {
      method: summaryApi.productDetails.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: params?.id,
      }),
    });
    const dataApi = await dataResponse.json();
    if (dataApi.success) {
      setData(dataApi?.data);
      setActivePhoto(dataApi?.data?.productPhoto[0].url);
      checkCartStatus(data);
      setSelectedSize("");
      setSelectedColor("");
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  const checkCartStatus = async (product, size, color) => {
    const dataApi = await productCartStatus();
    const cartItems = dataApi?.data || []; // Default to empty array if undefined

    // Check if the current product, with selected size and color, is in the cart
    const isProductAdded = cartItems?.some(
      (item) =>
        item.productId === product?._id &&
        item.size === size && // Use size parameter
        item.color === color // Use color parameter
    );

    setAddedProducts(isProductAdded); // Update the button state accordingly
    setLoadingUi(false);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleOnMouseEnter = (PhotoURL) => {
    setActivePhoto(PhotoURL);
  };

  const handlePhotoZoom = useCallback(
    (e) => {
      setPhotoZoom(true);
      const { left, top, width, height } = e.target.getBoundingClientRect();

      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      setZoomPhotoCoordinates({
        x,
        y,
      });
    },
    [photoZoomCoordinates]
  );

  const handleOnLeaveMouseEnter = () => {
    setPhotoZoom(false);
  };

  // Find all distinct colors across all sizes
  const distinctColors = [
    ...new Map(
      data.quantity.flatMap((variant) =>
        variant.colors.map((color) => [color.color, color])
      )
    ).values(),
  ];

  // Handle size selection
  const handleSizeSelect = async (size) => {
    const newSize = selectedSize === size ? "" : size; // Toggle size selection
    setSelectedSize(newSize); // Set the selected size
    await checkCartStatus(data, newSize, selectedColor); // Pass the updated size and current color
  };

  // Filter colors based on the selected size and quantity > 0
  const selectedSizeVariant = data.quantity.find(
    (variant) => variant.size === selectedSize
  );

  // Handle color selection
  const handleColorSelect = async (color) => {
    const newColor = selectedColor === color ? "" : color; // Toggle color selection
    setSelectedColor(newColor); // Set the selected color
    await checkCartStatus(data, selectedSize, newColor); // Pass the current size and updated color
  };

  // Check if the entire product is out of stock
  const isOutOfStock = data.quantity.every((variant) =>
    variant.colors.every((color) => color.quantity <= 0)
  );

  // Check if the selected size is out of stock (i.e., no colors have quantity > 0 for the selected size)
  const selectedSizeOutOfStock =
    selectedSize &&
    selectedSizeVariant?.colors.every((color) => color.quantity <= 0);

  // Check if the selected color is out of stock (i.e., no sizes have quantity > 0 for the selected color)
  const selectedColorOutOfStock =
    selectedColor &&
    data.quantity.every((variant) =>
      variant.colors.some(
        (color) => color.color === selectedColor && color.quantity <= 0
      )
    );

  // Determine if the product is out of stock either globally or based on the selected size or color
  const shouldShowOutOfStock =
    isOutOfStock || selectedSizeOutOfStock || selectedColorOutOfStock;

  const handleAddToCart = async (e, id) => {
    e.preventDefault();

    // Check if both size and color are selected
    if (!selectedSize || !selectedColor) {
      toast.error("Please select both size and color to add to cart.");
      return; // Exit the function if checks fail
    }

    const dataApi = await addToCart(e, id, selectedSize, selectedColor);
    if (dataApi.success) {
      fetchCartProductsCount();
      setAddedProducts(true); // Update state to reflect product added
      // await checkCartStatus(data); // Recheck cart status to update the button
    }
  };

  const handleBuyNow = async (e, id) => {
    e?.stopPropagation();
    e?.preventDefault();

    // Check if both size and color are selected
    if (!selectedSize || !selectedColor) {
      toast.error("Please select both size and color to proceed to buy.");
      return; // Exit the function if checks fail
    }

    const dataResponse = await fetch(summaryApi.addToCart.url, {
      method: summaryApi.addToCart.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ productId: id, selectedSize, selectedColor }),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      fetchCartProductsCount();
      navigate("/cart");
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="min-h-[200px] flex flex-col lg:flex-row gap-5 mb-8 bg-white p-4 pb-6 rounded-md shadow-md">
        {/***product Photo */}
        <div className="h-96 flex flex-col lg:flex-row-reverse gap-3 ">
          {loadingUi ? (
            <div className="h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2 rounded-md shadow animate-pulse transition-all"></div>
          ) : (
            <div className="h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2 rounded-md shadow">
              {!isVideo ? (
                <>
                  <img
                    src={activePhoto}
                    className="h-full w-full object-scale-down mix-blend-multiply cursor-crosshair"
                    onMouseMove={handlePhotoZoom}
                    onMouseLeave={handleOnLeaveMouseEnter}
                  />
                  {/**product zoom */}
                  {photoZoom && (
                    <div className="hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 z-20 p-1 -right-[520px] -top-[8px] rounded shadow">
                      <div
                        className="w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-130 "
                        style={{
                          background: `url(${activePhoto})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: `
                    ${photoZoomCoordinates.x * 100}%
                    ${photoZoomCoordinates.y * 100}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </>
              ) : (
                <video controls className="w-full h-[284px] lg:h-[370px]">
                  <source src={activePhoto} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          <div className="h-full">
            {loadingUi ? (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full">
                {productPhotoListLoading.map((e, index) => {
                  return (
                    <div
                      className="h-20 w-20 bg-slate-200 rounded animate-pulse"
                      key={"loadingPhoto" + index}
                    ></div>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full ">
                {data?.productPhoto?.map((photoUrl, index) => {
                  return (
                    <div
                      className={`h-20 w-20 bg-slate-200  rounded shadow  ${
                        activePhoto === photoUrl.url
                          ? "border-red-600 border-2 p-0.5"
                          : "p-1"
                      }`}
                      key={photoUrl.url}
                    >
                      {photoUrl.type === "image" ? (
                        <img
                          src={photoUrl.url}
                          className="w-full h-full object-scale-down mix-blend-multiply cursor-pointer"
                          onMouseEnter={() => {
                            handleOnMouseEnter(photoUrl.url);
                            setIsVideo(false);
                          }}
                          onClick={() => {
                            handleOnMouseEnter(photoUrl.url);
                            setIsVideo(false);
                          }}
                        />
                      ) : photoUrl.type === "video" ? (
                        <div
                          className="cursor-pointer w-full h-full flex items-center justify-center"
                          onMouseEnter={() => {
                            handleOnMouseEnter(photoUrl.url);
                            setIsVideo(true);
                          }}
                          onClick={() => {
                            handleOnMouseEnter(photoUrl.url);
                            setIsVideo(true);
                          }}
                        >
                          <FaCirclePlay className="text-4xl text-gray-700" />
                        </div>
                      ) : (
                        " "
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/***product details */}
        {loadingUi ? (
          <div className="grid gap-1 w-full">
            <p className="bg-slate-200 animate-pulse  h-6 lg:h-8 w-full inline-block"></p>
            <h2 className="text-2xl lg:text-4xl font-medium h-6 lg:h-8  bg-slate-200 animate-pulse w-40"></h2>
            <p className="capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8  w-80"></p>
            <p className="capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8  w-60"></p>

            <div className="text-red-600 bg-slate-200 h-6 lg:h-8  animate-pulse flex items-center gap-1 w-60"></div>

            <div className="flex gap-3 mb- w-full">
              <button className="h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-32"></button>
              <button className="h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-32"></button>
            </div>

            <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-0 lg:h-8  animate-pulse w-full">
              <p className="text-red-600 bg-slate-200 w-full"></p>
              <p className="text-slate-400 line-through bg-slate-200 w-full"></p>
            </div>

            <div className="w-full">
              <p className="text-slate-600 font-medium my-1 h-6 lg:h-8   bg-slate-200 rounded animate-pulse w-40"></p>
              <p className=" bg-slate-200 rounded animate-pulse h-10 lg:h-20  w-full"></p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {/* <p className="text-red-500 inline-block w-fit">{data?.brand}</p> */}
            <h2 className="text-2xl lg:text-4xl font-medium">
              {data?.productName}
            </h2>
            <p className="capitalize text-slate-400">{data?.category}</p>

            <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium mt-1">
              <p className="text-red-600">
                {currencyFormat(data.sellingPrice)}
              </p>
              <p className="text-slate-400 line-through">
                {currencyFormat(data.mrp)}
              </p>
            </div>

            {/* New section for sizes */}
            <div className="mt-2">
              {/* Sizes Section */}
              <div className="flex gap-2 mt-1">
                {data.quantity.map((variant) => {
                  const isDisabled = selectedColor
                    ? !variant.colors.some(
                        (color) =>
                          color.color === selectedColor && color.quantity > 0
                      ) // Disable size if selected color has 0 quantity for this size
                    : variant.colors.every(
                        (color) =>
                          color.quantity <= 0 || color.quantity === null
                      ); // Disable size if all colors for this size have 0 quantity

                  return (
                    <button
                      key={variant.size}
                      className={`text-md px-2 py-0.5 w-12 h-8 rounded uppercase ${
                        selectedSize === variant.size
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-white border border-black text-black hover:border-2 hover:border-black hover:bg-gray-200 "
                      }${
                        isDisabled ? "opacity-50 cursor-not-allowed z-10" : ""
                      }`}
                      onClick={() =>
                        !isDisabled && handleSizeSelect(variant.size)
                      }
                      disabled={isDisabled} // Disable the button if necessary
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors Section */}
            <div className="mt-2">
              <div className="flex gap-2 mt-1">
                {distinctColors.map((color) => {
                  const isDisabled = selectedSize
                    ? !selectedSizeVariant?.colors.some(
                        (c) => c.color === color.color && c.quantity > 0
                      ) // Disable color if selected size has 0 quantity for this color
                    : data.quantity.every((variant) =>
                        variant.colors.every(
                          (c) => c.color === color.color && c.quantity <= 0
                        )
                      ); // Disable color if all sizes for this color have 0 quantity

                  return (
                    <button
                      key={color.color}
                      className={`text-md rounded px-2 h-8 py-0.5 capitalize ${
                        selectedColor === color.color
                          ? "bg-red-600 text-white hover:bg-red-700 border border-red-600"
                          : "bg-white border border-black text-black hover:border-black hover:bg-gray-200"
                      } ${
                        isDisabled ? "opacity-50 cursor-not-allowed z-10" : ""
                      }`} // Ensure both opacity and cursor reflect disabled state
                      onClick={() =>
                        !isDisabled && handleColorSelect(color.color)
                      }
                      disabled={isDisabled} // Disable the button if necessary
                    >
                      {color.color}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display "Out of Stock" if no size or color is available, or if the selected combination is out of stock */}
            {shouldShowOutOfStock ? (
              <p className="text-3xl my-2 font-medium text-red-500">
                Out of Stock
              </p>
            ) : (
              <>
                <div className="flex items-center gap-3 my-2 mt-4">
                  <button
                    className="rounded px-3 py-1.5 min-w-[120px] bg-red-600 text-white font-medium hover:bg-red-700 hover:text-white"
                    onClick={(e) => handleBuyNow(e, data?._id)}
                  >
                    Buy Now
                  </button>
                  <button
                    className={`rounded px-3 py-1.5 min-w-[120px] font-medium text-white ${
                      addedProducts
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    onClick={(e) => handleAddToCart(e, data?._id)}
                    disabled={addedProducts} // Disable if already added
                  >
                    {addedProducts ? "Product Added" : "Add to Cart"}
                  </button>
                </div>
              </>
            )}

            <div>
              <p className="text-slate-600 font-medium my-1">Description: </p>
              <p>{data?.description}</p>
            </div>
          </div>
        )}

        {/* {addedProducts ? <div className="h-10 w-10 bg-red-600"></div> : null} */}
      </div>

      {data.category && (
        <HorizontalProductList
          category={data?.category}
          title={"Similar Products"}
        />
      )}
    </div>
  );
};

export default ProductDetails;
