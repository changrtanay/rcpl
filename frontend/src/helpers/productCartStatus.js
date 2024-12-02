import summaryApi from "../common";

const productCartStatus = async () => {
  const dataResponse = await fetch(summaryApi.productCartStatus.url, {
    method: summaryApi.productCartStatus.method,
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
  });
  const dataApi = await dataResponse.json();
  
  
  if (dataApi.success) {
    return dataApi;
  } else {
    return [];
  }
};

export default productCartStatus;
