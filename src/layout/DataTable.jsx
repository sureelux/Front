import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faPlus,
  faUser,
  faTable,
  faClipboardList,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function DataTable() {
  const [tables, setTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(3);
  const [filterStatus, setFilterStatus] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getTables = async () => {
      try {
        const response = await axios.get(`http://localhost:8889/user/tables`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTables(response.data.tables);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };
    getTables();
  }, [token]);

  const hdlDelete = async (e, table_id) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "คุณต้องการลบข้อมูลหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8889/admin/deleteTable/${table_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTables(tables.filter((table) => table.table_id !== table_id));
        Swal.fire({
          icon: "success",
          title: "ลบข้อมูลเรียบร้อย",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#3996fa",
        });
      } catch (err) {
        console.error("Error deleting table:", err);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการลบข้อมูล",
          text: err.message,
          confirmButtonColor: "#3996fa",
        });
      }
    }
  };

  const handleEditClick = async (table) => {
    try {
      const tableTypesResponse = await axios.get(
        "http://localhost:8889/admin/types",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const tableTypes = tableTypesResponse.data.types || [];

      const { value: formValues } = await Swal.fire({
        title: "แก้ไขข้อมูลโต๊ะ",
        html: `
        `,
        focusConfirm: false,
        preConfirm: () => ({
          table_img: document.getElementById("table_img").value,
          table_name: document.getElementById("table_name").value,
          table_status: document.getElementById("table_status").value,
          table_seat: parseInt(document.getElementById("table_seat").value, 10),
          table_price: parseInt(
            document.getElementById("table_price").value,
            10
          ),
          type_id: document.getElementById("type_id").value,
        }),
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        showCancelButton: true,
        cancelButtonColor: "#eb3b4c",
        confirmButtonColor: "#27ba48",
      });

      if (formValues) {
        await axios.patch(
          `http://localhost:8889/admin/updateTable/${table.table_id}`,
          formValues,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "ข้อมูลถูกแก้ไขเรียบร้อย",
          showConfirmButton: false,
          timer: 1500,
        });
        const response = await axios.get("http://localhost:8889/user/tables", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTables(response.data.tables);
      }
    } catch (error) {
      console.error("Error editing table:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถแก้ไขข้อมูลได้",
      });
    }
  };

  const filteredTables = tables.filter((table) => {
    const searchTermLower = searchTerm.toLowerCase();
    const priceString = table.table_price ? table.table_price.toString() : "";
    const seatString = table.table_seat ? table.table_seat.toString() : "";
  
    return (
      (table.table_id && table.table_id.toString().includes(searchTermLower)) ||
      (table.table_name && table.table_name.toLowerCase().includes(searchTermLower)) ||
      (priceString && priceString.includes(searchTermLower)) ||
      (seatString && seatString.includes(searchTermLower)) ||
      (table.type_table &&
        table.type_table.type_name &&
        table.type_table.type_name.toLowerCase().includes(searchTermLower)) ||
      (table.table_status === "FREE" && "ว่าง".includes(searchTermLower)) ||
      (table.table_status === "BUSY" && "ไม่ว่าง".includes(searchTermLower))
    );
  });
  

  const freeCount = filteredTables.filter(
    (table) => table.table_status === "FREE"
  ).length;
  const busyCount = filteredTables.filter(
    (table) => table.table_status === "BUSY"
  ).length;

  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredTables.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredTables.length / perPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleShowAllTables = () => {
    setFilterStatus(null);
  };
  

  const handleFreeClick = () => {
    setFilterStatus("FREE");
  };

  const handleBusyClick = () => {
    setFilterStatus("BUSY");
  };

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center mt-20">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-info drawer-button lg:hidden text-white font-normal mt-5"
          >
            ดูข้อมูล
          </label>
          <div className="overflow-autos w-full h-screen mt-15">
            <p className="mt-3 ml-2 text-3xl font-bold drop-shadow-[2px_2px_var(--tw-shadow-color)] shadow-gray-300">
              รายละเอียดข้อมูลโต๊ะ
            </p>
            <hr className="border my-5 ml-10 border-sky-400 dark:border-sky-300" />
            <p className="text-2xl font-semibold text-gray-700 ml-10 cursor-pointer" onClick={handleShowAllTables}>
              จำนวนข้อมูลโต๊ะทั้งหมด : {" "}
              <spen className="text-3xl text-sky-500">
                {filteredTables.length}{" "}
              </spen>
            </p>
            <div className="flex flex-row space-x-2">
              <p
                className="text-lg font-semibold text-gray-700 ml-10 mt-2 border border-gray-300 p-2 rounded bg-gray-100 flex items-center w-96 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={handleFreeClick}
              >
                <i className="fas fa-check-circle text-green-600 mr-2"></i>
                จำนวนโต๊ะ (ว่าง) : {" "}
                <span className="text-2xl text-green-600 ml-2">
                  {freeCount}
                </span>
              </p>
              <p
                className="text-lg font-semibold text-gray-700 ml-10 mt-2 border border-gray-300 p-2 rounded bg-gray-100 flex items-center w-96 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={handleBusyClick}
              >
                <i className="fas fa-times-circle text-red-600 mr-2"></i>
                จำนวนโต๊ะ (ไม่ว่าง) : {" "}
                <span className="text-2xl text-red-600 ml-2">{busyCount}</span>
              </p>
            </div>

            <div className="flex justify-end items-end mb-2">
              <div className="flex items-center mr-5">
                <label
                  htmlFor="default-search"
                  className="text-sm font-bold text-gray-700 dark:text-gray-300 mr-2"
                >
                  ค้นหา
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="default-search"
                    className="block p-2 pl-10 text-sm w-80 border border-gray-500 rounded-lg bg-gray-50 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="ค้นหา"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mr-8">
              <div className="mt-1">
                <Link
                  className="btn btn-success drawer-button text-white font-normal rounded-xl shadow-xl"
                  to="/CreateTable"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Link>
              </div>
            </div>

            {filteredTables.length > 0 ? (
              <table className="table mt-2">
                <thead>
                  <tr className="text-sm text-black uppercase bg-gradient-to-r from-sky-400 to-cyan-300 text-center">
                    <th>ลำดับ</th>
                    <th>ภาพ</th>
                    <th>ชื่อโต๊ะ</th>
                    <th>สถานะโต๊ะ</th>
                    <th>จำนวนที่นั่ง</th>
                    <th>ราคา</th>
                    <th>ประเภทโต๊ะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-black text-center">
                  {currentItems
                    .filter((tables) =>
                      filterStatus ? tables.table_status === filterStatus : true
                    )
                    .map((tables, index) => (
                      <tr
                        key={tables.table_id}
                        tables={tables}
                        className="bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <td>{index + 1 + indexOfFirstItem}</td>
                        <td className="flex justify-center items-center">
                          <figure className="hover:scale-110 transition duration-300 ease-in-out">
                            <img
                              src={tables.table_img}
                              className="max-w-32 rounded-lg shadow-lg"
                            />
                          </figure>
                        </td>

                        <td>{tables.table_name}</td>
                        <td
                          className={
                            tables.table_status === "FREE"
                              ? "text-green-500"
                              : tables.table_status === "BUSY"
                              ? "text-red-500 font-medium"
                              : ""
                          }
                        >
                          {tables.table_status === "FREE"
                            ? "ว่าง"
                            : tables.table_status === "BUSY"
                            ? "ไม่ว่าง"
                            : ""}
                        </td>
                        <td>{tables.table_seat}</td>
                        <td>{tables.table_price}</td>
                        <td>{tables.type_table.type_name}</td>
                        <td className="border border-gray-300">
                          <div className="justify-center ">
                            <button
                              className="btn btn-warning text-black text-xs font-normal rounded-xl shadow-xl"
                              style={{ marginRight: "20px" }}
                              onClick={() => handleEditClick(tables)}
                            >
                              <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                            </button>

                            <button
                              className="btn btn-error text-white text-xs font-normal rounded-xl shadow-xl"
                              onClick={(e) => hdlDelete(e, tables.table_id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div>
                <table className="table table-zebra mt-4">
                  <thead>
                    <tr className="text-sm text-black uppercase bg-gradient-to-r from-sky-400 to-cyan-300 text-center">
                      <th>ลำดับ</th>
                      <th>ภาพ</th>
                      <th>ชื่อโต๊ะ</th>
                      <th>สถานะโต๊ะ</th>
                      <th>จำนวนที่นั่ง</th>
                      <th>ราคา</th>
                      <th>ประเภทโต๊ะ</th>
                      <th>การดำเนินการ</th>
                    </tr>
                  </thead>
                </table>
                <p className="text-center text-xl font-bold text-gray-500 mt-10">
                  ไม่พบข้อมูลโต๊ะ
                </p>
              </div>
            )}
            {filteredTables.length > perPage && (
              <div className="mt-2 flex items-center justify-center space-x-4">
                <button
                  className="bg-sky-500 text-white rounded-full px-4 py-2 hover:bg-sky-600 disabled:bg-sky-300 text-xs"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  ก่อนหน้า
                </button>
                <span className="text-sm text-gray-900">
                  หน้า {currentPage} จาก{" "}
                  {Math.ceil(filteredTables.length / perPage)}
                </span>
                <button
                  className="bg-sky-500 text-white rounded-full px-4 py-2 hover:bg-sky-600 disabled:bg-sky-300 text-xs"
                  onClick={nextPage}
                  disabled={
                    currentPage === Math.ceil(filteredTables.length / perPage)
                  }
                >
                  ถัดไป
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="drawer-side mt-20 overflow-y-hidden">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-60 min-h-full bg-gradient-to-r from-sky-100 to-sky-400">
            <li>
              <Link
                to="/DataUser"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/DataUser")
                    ? "bg-black text-white font-bold"
                    : "bg-opacity-55 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" /> ข้อมูลผู้ใช้
              </Link>
            </li>
            <li>
              <Link
                to="/DataType"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/DataType")
                    ? "bg-black text-white font-bold"
                    : "bg-opacity-55 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faTable} className="mr-2" />
                ข้อมูลประเภทโต๊ะ
              </Link>
            </li>
            <li>
              <Link
                to="/DataTable"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/DataTable")
                    ? "bg-black text-white font-bold"
                    : "bg-opacity-55 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                ข้อมูลโต๊ะ
              </Link>
            </li>
            <li>
              <Link
                to="/DataBooing_Approval"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/DataBooing_Approval")
                    ? "bg-black text-white font-bold"
                    : "bg-opacity-55 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                ข้อมูลการจอง (รออนุมัติ)
              </Link>
            </li>
            <li>
              <Link
                to="/DataBooking"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/DataBooking")
                    ? "bg-black text-white font-bold"
                    : "bg-opacity-55 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                ข้อมูลการจอง
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
