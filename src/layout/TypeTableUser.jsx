import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../hooks/userAuth";

export default function Tables() {
  const [tables, setTables] = useState(null);
  const [types, setTypes] = useState(null);
  const [typetable, setTypeTable] = useState(null);
  const [nameType, setNameType] = useState("");
  const { user } = userAuth();
  const navigate = useNavigate();
  const TypeTable = decodeURIComponent(location.pathname.split("/")[2]);
  // console.log(TypeTable)

  const getTables = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8889/admin/tables`,
        {
          headers: { Authorization: `Bearer ${token}` },
        } 
      );
      setTables(response.data.tables);
      // console.log(tables)
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const getTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8889/admin/types`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }   
      );
      setTypes(response.data.types);
      // console.log(types)
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const getTypeTable = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8889/user/TypeTableUser?type=${TypeTable}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }   
      );
      setTypeTable(response.data.dTpye); 
      setNameType(response.data.type);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };
  useEffect(() => {
    getTypeTable();
    console.log(typetable);
  }, [TypeTable]);

  const hdlBooking = (id) => {
    user?.user_id ? navigate(`/BookingTable/${id}`) : navigate("/login");
  };

  return (
      <div>
        <div className="text-4xl font-bold shadow-lg bg-gradient-to-l from-green-400 via-violet-400 to-pink-400 text-white p-4 mt-24 text-center">
            <div  className="[text-shadow:2px_1px_6px_var(--tw-shadow-color)] shadow-gray-800 animate-pulse">{nameType}</div>
        </div>
        <hr className="my-4 border-2 border-gray-400 w-[1350px] mt-8 text-center mx-auto rounded-full"/>
        <div className="max-w-[100rem] mx-auto gap-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
          {typetable &&
            typetable.map((item) => (
              <div
                key={item.table_id}
                className="card-body items-center text-center"
              >
                <div className="card w-80 border-2 border-gray-500 shadow-2xl bg-white bg-[url('path-to-your-pattern.png')] bg-contain bg-no-repeat">
                  <figure className="px-10 pt-10 hover:scale-110 transition duration-300 ease-in-out">
                    <img src={item.table_img} alt="" />
                  </figure>
                  <div className="flex flex-col gap-3 mt-3">
                    <h3 className="text-xl font-bold">{item.table_name}</h3>
                    <p className="product-price font-bold text-2xl">
                      ราคา :{" "}
                      <label className="text-red-600 text-xl font-bold ">
                        {item.table_price}
                      </label>{" "}
                      บาท
                    </p>
                    <h3
                      key={item.type_table.type_id}
                      className="product-category font-bold"
                    >
                      ประเภท :{" "}
                      <label className="text-base font-normal ">
                        {item.type_table.type_name}
                      </label>
                    </h3>
                    <h3 className="font-bold">
                      สถานะ :{" "}
                      <label
                        className={`text-base font-normal ${
                          item.table_status === "FREE"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.table_status === "FREE" ? "ว่าง" : "ไม่ว่าง"}
                      </label>
                    </h3>
                    <div className="card-actions mx-auto px-20 text-center">
                      <button
                        disabled={item.table_status === "BUSY"}
                        onClick={() => hdlBooking(item.table_id)}
                        className="text-white bg-gradient-to-r from-blue-500 to-blue-400 hover:bg-gradient-to-l focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-8 disabled:opacity-50 disabled:cursor-no-drop shadow-xl"
                      >
                        จอง
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
  );
}
