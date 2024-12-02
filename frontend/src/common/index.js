const backendDomain = process.env.REACT_APP_BACKEND_URL;

const summaryApi = {
  signUp: {
    url: `${backendDomain}/api/sign-up`,
    method: "post",
  },
  signIn: {
    url: `${backendDomain}/api/sign-in`,
    method: "post",
  },
  current_user: {
    url: `${backendDomain}/api/user-details`,
    googleUrl: `${backendDomain}/api/user-details`,
    method: "get",
  },
  signOut: {
    url: `${backendDomain}/api/sign-out`,
    method: "get",
  },
  allUsers: {
    url: `${backendDomain}/api/all-users`,
    method: "get",
  },
  updateUser: {
    url: `${backendDomain}/api/update-user`,
    method: "post",
  },
  addProduct: {
    url: `${backendDomain}/api/add-product`,
    method: "post",
  },
  allProducts: {
    url: `${backendDomain}/api/all-products`,
    method: "get",
  },
  updateProduct: {
    url: `${backendDomain}/api/update-product`,
    method: "post",
  },
  categoryProductOne: {
    url: `${backendDomain}/api/category-product-one`,
    method: "get",
  },
  categoryProducts: {
    url: `${backendDomain}/api/category-products`,
    method: "post",
  },
  productDetails: {
    url: `${backendDomain}/api/product-details`,
    method: "post",
  },
  addToCart: {
    url: `${backendDomain}/api/add-to-cart`,
    method: "post",
  },
  cartProductsCount: {
    url: `${backendDomain}/api/cart-products-count`,
    method: "get",
  },
  productCartStatus: {
    url: `${backendDomain}/api/product-cart-status`,
    method: "get",
  },
  cartProducts: {
    url: `${backendDomain}/api/cart-products`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backendDomain}/api/update-cart-product`,
    method: "post",
  },
  removeCartProduct: {
    url: `${backendDomain}/api/remove-cart-product`,
    method: "post",
  },
  searchProduct: {
    url: `${backendDomain}/api/search-product`,
    method: "get",
  },
  filterProducts: {
    url: `${backendDomain}/api/filter-products`,
    method: "post",
  },
  payment: {
    url: `${backendDomain}/api/payment`,
    method: "post",
  },
  stripeWebhook: {
    url: `${backendDomain}/api/stripe-webhook`,
    method: "post",
  },
  orders: {
    url: `${backendDomain}/api/orders`,
    method: "get",
  },
  addAddress: {
    url: `${backendDomain}/api/add-address`,
    method: "post",
  },
  address: {
    url: `${backendDomain}/api/address`,
    method: "get",
  },
  updateAddress: {
    url: `${backendDomain}/api/update-address`,
    method: "post",
  },
  forgotPassword: {
    url: `${backendDomain}/api/forgot-password`,
    method: "post",
  },
  resetPassword: {
    url: `${backendDomain}/api/reset-password`,
    method: "put",
  },
  allOrders: {
    url: `${backendDomain}/api/all-orders`,
    method: "get",
  },
  addOrder: {
    url: `${backendDomain}/api/add-order`,
    method: "post",
  },
  updateOrder: {
    url: `${backendDomain}/api/update-order`,
    method: "post",
  },
};

export default summaryApi;
