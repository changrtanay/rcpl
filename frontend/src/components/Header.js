import React, { useContext, useState } from "react";
import Logo from "./Logo";
import logo from "../assets/rc_logo2.png";
import { GrSearch } from "react-icons/gr";
import { HiOutlineUser } from "react-icons/hi2";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import summaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);

  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [searchProduct, setSearchProduct] = useState(searchQuery);

  const handleUserIconClick = () => {
    setMenuDisplay((prev) => !prev);
  };

  const handleOnSignOut = async () => {
    const dataResponse = await fetch(summaryApi.signOut.url, {
      method: summaryApi.signOut.method,
      credentials: "include",
    });

    const data = await dataResponse.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    } else if (data.error) {
      toast.error(data.message);
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearchProduct(value);
  };

  const handleSearch = () => {
    if (searchProduct) {
      navigate(`/search?q=${searchProduct}`);
    }
  };

  const handleOnPressEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-50">
      <div className="h-full container mx-auto flex items-center md:px-4 sm:md:px-2 px-1 justify-between">
        <div className="md:mr-36 sm:mr-32 mr-28">
          <Link to="/" className="cursor-pointer">
            {/* <Logo w={90} h={50} /> */}
            <img
              src={logo}
              width={110}
              height={50}
              className="mix-blend-multiply absolute -top-0"
            />
          </Link>
        </div>

        <div className="flex items-center sm:w-full justify-between max-w-60 md:max-w-96 border rounded-full focus-within:shadow pl-2">
          <input
            type="text"
            placeholder="Search "
            className="sm:w-full w-20 outline-none sm:px-2"
            onChange={handleOnChange}
            onKeyPress={handleOnPressEnter}
            value={searchProduct}
          />
          <div
            className={`text-lg min-w-[50px] h-8 bg-red-600 border sm:flex items-center justify-center rounded-r-full text-white cursor-pointer"
            ${user?._id ? "hidden" : "flex"}`}
            onClick={handleSearch}
          >
            <GrSearch className="text-xl" />
          </div>
        </div>

        <div className="flex items-center md:gap-7 sm:gap-5 gap-3.5">
          {user?._id && (
            <Link to={"/cart"} className="relative cursor-pointer">
              <span className="text-2xl">
                <FaShoppingCart />
              </span>
              <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
                <p className="text-xs">{context.cartProductsCount}</p>
              </div>
            </Link>
          )}

          <div className="relative flex justify-center">
            {user?._id && (
              <div
                className="text-3xl cursor-pointer"
                onClick={handleUserIconClick}
              >
                {user?.profilePhoto ? (
                  <img
                    src={user?.profilePhoto}
                    className="w-8 h-8 rounded-full"
                    alt={user?.name}
                  />
                ) : (
                  <HiOutlineUser className="-mr-1 sm:mr-0" />
                )}
              </div>
            )}
            {menuDisplay && user?._id && (
              <div className="absolute bg-white bottom-0 flex flex-col gap-1 justify-center top-10 h-fit shadow-md border rounded">
                {user?.role === ROLE.ADMIN && (
                  <Link
                    to="admin-panel/all-users"
                    className="whitespace-nowrap p-2 hover:bg-slate-100"
                    onClick={() => setMenuDisplay((prev) => !prev)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="orders"
                  className="whitespace-nowrap p-2 flex justify-center hover:bg-slate-100"
                  onClick={() => setMenuDisplay((prev) => !prev)}
                >
                  <span>Orders</span>
                </Link>
              </div>
            )}
          </div>

          <div>
            {user?._id ? (
              <button
                onClick={handleOnSignOut}
                className="md:px-3 px-2 md:font-medium h-8 py-1 text-xs md:text-sm rounded-full bg-red-600 text-white hover:bg-red-700 transition-all"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/sign-in"
                className="md:px-14 sm:px-12 px-2 h-8 py-1 rounded-full text-white hover:bg-red-700 transition-all bg-red-600"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
