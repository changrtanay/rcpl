import summaryApi from "../common";
import { toast } from "react-toastify";

const addToCart = async (e, id, selectedSize, selectedColor) => {
  e?.stopPropagation();
  e?.preventDefault();

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
    toast.success(dataApi.message);
  } else if (dataApi.error) {
    toast.error(dataApi.message);
  }

  return dataApi;
};

export default addToCart;
