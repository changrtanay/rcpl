import React, { useEffect, useState } from "react";
import summaryApi from "../common";
import { toast } from "react-toastify";
import moment from "moment";
import { MdEdit, MdRefresh } from "react-icons/md";
import UpdateUser from "../components/UpdateUser";

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [updateUserPanel, setUpdateUserPanel] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    _id: "",
    name: "",
    email: "",
    role: "",
  });

  let fetchAllUsers = async () => {
    const dataResponse = await fetch(summaryApi.allUsers.url, {
      method: summaryApi.allUsers.method,
      credentials: "include",
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      setAllUsers(dataApi.data);
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div>

      <div className="bg-white px-3 py-2 flex justify-between items-center">
        <h2 className="font-bold text-lg">All Users</h2>
        <button className="px-4" onClick={()=>fetchAllUsers()}><MdRefresh className="text-3xl text-red-600 hover:bg-gray-200 hover:text-red-500 transition-all rounded-full p-0.5"/></button>
      </div>

      <div className="pt-1.5">
        <table className=" w-full bg-white">
          <thead className="font-medium">
            <tr>
              <th className="border">Sr.</th>
              <th className="border">Name</th>
              <th className="border">Email</th>
              <th className="border">Role</th>
              <th className="border">Created on</th>
              <th className="border">Edit</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((e, i) => {
              return (
                <tr className="text-center">
                  <td className="border">{i + 1}</td>
                  <td className="border">{e?.name}</td>
                  <td className="border">{e?.email}</td>
                  <td className="border">{e?.role}</td>
                  <td className="border">
                    {moment(e?.createdAt).format("D MMMM, YYYY")}
                  </td>
                  <td className="border text-lg">
                    <button
                      className="hover:bg-green-200 hover:rounded-full p-1"
                      onClick={() => {
                        setUpdateUserDetails(e);
                        setUpdateUserPanel(true);
                      }}
                    >
                      <MdEdit className="cursor-pointer " />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {updateUserPanel && (
          <UpdateUser
            handleOnClose={() => setUpdateUserPanel(false)}
            userId={updateUserDetails._id}
            name={updateUserDetails.name}
            email={updateUserDetails.email}
            role={updateUserDetails.role}
            refresh={fetchAllUsers}
          />
        )}
      </div>
    </div>
  );
};

export default AllUsers;
