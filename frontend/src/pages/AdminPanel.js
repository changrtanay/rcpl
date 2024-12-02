import React, { useEffect } from "react";
import { GiSpy } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../common/role";

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate()

  useEffect(()=>{
    if(user?.role!==ROLE.ADMIN){
      navigate("/")
    }
  })
  return (
    <div className="min-h-[calc(100vh-120px)] md:flex hidden">
      <aside className="text-black min-h-full w-full min-w-56 max-w-56 pt-8 ml-3.5 mr-1 my-3 bg-white rounded-md shadow-md">
        <div className="h-24 flex justify-center items-center flex-col">
          <div className="text-8xl relative flex justify-center">
            {user?.profilePhoto ? (
              <img
                src={user?.profilePhoto}
                className="w-20 h-20 rounded-full"
                alt={user?.name}
              />
            ) : (
              <GiSpy />
            )}
          </div>
          <p className="capitalize text-lg font-semibold cursor-default">
            {user?.name ? <p>{user?.name}</p> : <p className="pt-2">ADMIN ?</p>}
          </p>
          <p className="text-sm cursor-default">{user?.role}</p>
        </div>

        <div>
          <nav className="flex flex-col p-4 pt-8">
            <Link to={"all-users"} className="px-2 py-1 hover:bg-slate-100">
              All Users
            </Link>
            <div className="pt-1"> </div>
            <Link
              to={"all-products"}
              className="px-2 py-1 w-full hover:bg-slate-100"
            >
              All Products
            </Link>
            <div className="pt-1"> </div>
            <Link
              to={"all-orders"}
              className="px-2 py-1 w-full hover:bg-slate-100"
            >
              All Orders
            </Link>
          </nav>
        </div>
      </aside>
      <main className="w-full h-full p-2 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
