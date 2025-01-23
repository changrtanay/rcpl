import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import summaryApi from "./common";
import Context from "./context";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();
  const [cartProductsCount, setCartProductsCount] = useState(0);

  const fetchUserDetails = async () => {
    const dataResponse = await fetch(summaryApi.current_user.url, {
      method: summaryApi.current_user.method,
      credentials: "include",
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      dispatch(setUserDetails(dataApi.data));
    }
  };

  const fetchCartProductsCount = async () => {
    const dataResponse = await fetch(summaryApi.cartProductsCount.url, {
      method: summaryApi.cartProductsCount.method,
      credentials: "include",
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      setCartProductsCount(dataApi.data.count);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchCartProductsCount();
    // Check if the script is already added
    if (!document.querySelector(`script[src="https://app.fastbots.ai/embed.js"]`)) {
      const script = document.createElement("script");
      script.defer = true;
      script.src = "https://app.fastbots.ai/embed.js";
      script.setAttribute("data-bot-id", process.env.REACT_APP_FASTBOT_ID);
      document.body.appendChild(script);
  
      console.log("Chatbot script added");
      };
  }, []);

  return (
    <Context.Provider
      value={{
        fetchUserDetails,
        fetchCartProductsCount,
        cartProductsCount,
      }}
    >
      <ToastContainer position="top-center" />
      <Header />
      <main className="lg:min-h-[calc(100vh-50px)] min-h-[calc(100vh-120px)] pt-16">
        <Outlet />
      </main>
      <Footer />
    </Context.Provider>
  );
}

export default App;
