import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../hooks/userAuth";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [types, setTypes] = useState([]);
  const [typetable, setTypeTable] = useState([]);
  const [nameType, setNameType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  const { user } = userAuth();
  const navigate = useNavigate();
  const TypeTable = decodeURIComponent(location.pathname.split("/")[2]);
  const token = localStorage.getItem("token");

  const getTables = async () => {
    try {
      const response = await axios.get(`http://localhost:8889/admin/tables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTables(response.data.tables || []);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const getTypes = async () => {
    try {
      const response = await axios.get(`http://localhost:8889/admin/types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTypes(response.data.types || []);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const getTypeTable = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8889/user/TypeTableUser?type=${TypeTable}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTypeTable(response.data.dTpye || []);
      setNameType(response.data.type || "");
    } catch (error) {
      console.error("Error fetching type table:", error);
    }
  };

  const getTypeHome = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8889/getType?type=${TypeTable}`
      );
      setTypeTable(response.data.dTpye || []);
      setNameType(response.data.type || "");
    } catch (error) {
      console.error("Error fetching home type:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getTables();
      getTypes();
      getTypeTable();
    } else {
      getTypeHome();
    }
  }, [TypeTable]);

  const hdlBooking = (id) => {
    user?.user_id ? navigate(`/BookingTable/${id}`) : navigate("/login");
  };

  const filteredTables = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return tables.filter((table) =>
      table.table_name.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [tables]);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < Math.ceil(filteredTables.length / itemsPerPage)
        ? prevPage + 1
        : prevPage
    );
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTables = filteredTables?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      <div className="text-4xl font-bold shadow-lg bg-gradient-to-l from-green-400 via-violet-400 to-pink-400 text-white p-4 mt-24 text-center">
        <div className="[text-shadow:2px_1px_6px_var(--tw-shadow-color)] shadow-gray-800 animate-pulse">
          {nameType}
        </div>
      </div>

      <div className="relative my-2 w-[1450px] mt-3">
        <hr className="absolute top-0 left-0 w-full h-1 rounded-full animate-pulse bg-gradient-to-r from-gray-300 to-gray-600" />
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-transparent animated-gradient"></div>
      </div>

      <div className="max-w-[100rem] mx-auto gap-4 grid grid-cols-4 grid-rows-2 justify-items-center">
        {typetable.map((item) => (
          <div
            key={item.table_id}
            className="card-body items-center text-center"
          >
            <div className="relative my-2 w-full">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-transparent animated-gradient"></div>
            </div>
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
                <h3 className="product-category font-bold">
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
      <div className="flex justify-center items-center mt-4 mx-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <span className="text-xl font-semibold px-4">
          หน้า {currentPage} / {Math.ceil(filteredTables.length / itemsPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(filteredTables.length / itemsPerPage)
          }
          className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            currentPage === Math.ceil(filteredTables.length / itemsPerPage)
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
        >
          <FaArrowRight className="text-xl" />
        </button>
      </div>
    </div>
  );
}
