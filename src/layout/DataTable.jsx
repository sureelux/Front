import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
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
  const fileInput = useRef(null);
  const [selectFile, setSelectFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tables, setTables] = useState([]);
  const [tableEdit, setTableEdit] = useState([]);
  const [tableTypes, setTableTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(3);
  const [filterStatus, setFilterStatus] = useState(null);
  const [loading, setLoading] = useState(false);

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

    const getTableType = async () => {
      const { data: tableTypesResponse } = await axios.get(
        "http://localhost:8889/admin/types",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTableTypes(tableTypesResponse.types);
    }

    getTableType();
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

  const hdlChangeFile = () => {
    const file = fileInput.current.files[0];
    setSelectFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  console.log(imagePreview)

  const hdlSetData = (table) => {
    setTableEdit(table);
  }

  const handleEditClick = async (id) => {
    setLoading(true)
    try {
      const file = fileInput.current ? fileInput.current.files[0] : null;
      const formData = new FormData();
      Object.entries(tableEdit).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (file) {
        formData.append("image", file);
      }

      if (formData) {
        console.log("Form Values:", formData);

        const response = await axios.patch(
          `http://localhost:8889/admin/updateTable/${id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Server Response:", response.data);
        if(response.status === 200){
          document.getElementById("my_modal_1").close();
          setLoading(false)
        }
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "ข้อมูลถูกแก้ไขเรียบร้อย",
          showConfirmButton: false,
          timer: 1500,
        });

        const { data: tablesResponse } = await axios.get(
          "http://localhost:8889/user/tables",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTables(tablesResponse.tables);
      }
      0;
    } catch (error) {
      document.getElementById("my_modal_1").close();
      console.log(error)
      console.log("Error editing table:", error.response?.data.message);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถแก้ไขข้อมูลได้",
      }).then(() => {
        document.getElementById("my_modal_1").showModal();
      })
    }
  };

  const filteredTables = tables.filter((table) => {
    const searchTermLower = searchTerm.toLowerCase();
    const priceString = table.table_price ? table.table_price.toString() : "";
    const seatString = table.table_seat ? table.table_seat.toString() : "";

    return (
      (table.table_id && table.table_id.toString().includes(searchTermLower)) ||
      (table.table_name &&
        table.table_name.toLowerCase().includes(searchTermLower)) ||
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

  const hdlChangeEdit = (e) => {
    setTableEdit( (prev) => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

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
            <p
              className="text-2xl font-semibold text-gray-700 ml-10 cursor-pointer"
              onClick={handleShowAllTables}
            >
              จำนวนข้อมูลโต๊ะทั้งหมด :{" "}
              <span className="text-3xl text-sky-500">
                {filteredTables.length}{" "}
              </span>
            </p>
            <div className="flex flex-row space-x-2">
              <p
                className="text-lg font-semibold text-gray-700 ml-10 mt-2 border border-gray-300 p-2 rounded bg-gray-100 flex items-center w-96 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={handleFreeClick}
              >
                <i className="fas fa-check-circle text-green-600 mr-2"></i>
                จำนวนโต๊ะ (ว่าง) :{" "}
                <span className="text-2xl text-green-600 ml-2">
                  {freeCount}
                </span>
              </p>
              <p
                className="text-lg font-semibold text-gray-700 ml-10 mt-2 border border-gray-300 p-2 rounded bg-gray-100 flex items-center w-96 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={handleBusyClick}
              >
                <i className="fas fa-times-circle text-red-600 mr-2"></i>
                จำนวนโต๊ะ (ไม่ว่าง) :{" "}
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
                <tbody className="font-medium text-black text-center text-sm">
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
                              onClick={() => {
                                document
                                  .getElementById("my_modal_1")
                                  .showModal();
                                  hdlSetData(tables);
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
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
              <div className="mt-4 flex items-center justify-center space-x-4">
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
      <dialog id="my_modal_1" className="modal">
        <div className="relative space-y-6 bg-white rounded-xl shadow-md p-7">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={() => document.getElementById("my_modal_1").close()}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <div className="text-3xl font-bold text-center">แก้ไขข้อมูลโต๊ะ</div>
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
              <label htmlFor="table_img" className="font-bold text-lg w-32">
                รูปโต๊ะ
              </label>
              <input
                type="file"
                className="file-input file-input-bordered file-input-xs w-full h-6 max-w-xs"
                id="fileInput"
                ref={fileInput}
                onChange={(event) => hdlChangeFile(event)}
              />
            </div>
            <div className="max-w-[200px] max-h-[200px] mx-auto my-2">
              <img className="rounded-md" src={!imagePreview ? tableEdit.table_img : imagePreview} alt="" />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="table_name" className="font-bold text-lg w-32">
                ชื่อโต๊ะ
              </label>
              <input
                id="table_name"
                name="table_name"
                type="text"
                onChange={hdlChangeEdit}
                className="text-lg w-80 rounded-lg border border-gray-400 p-2"
                value={tableEdit.table_name}
                placeholder="ชื่อโต๊ะ"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="table_status" className="font-bold text-lg w-32">
                สถานะ
              </label>
              <select
                id="table_status"
                name="table_status"
                onChange={hdlChangeEdit}
                className="text-lg w-80 rounded-lg border border-gray-400 p-2 bg-gray-200 text-gray-500 cursor-not-allowed"
                value={tableEdit.table_status}

                disabled
              >
                <option value="FREE" className="bg-green-100 text-green-800">
                  ว่าง
                </option>
                <option value="BUSY" className="bg-red-100 text-red-800">
                  ไม่ว่าง
                </option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="table_seat" className="font-bold text-lg w-32">
                จำนวนที่นั่ง
              </label>
              <input
                id="table_seat"
                type="number"
                name="table_seat"
                onChange={hdlChangeEdit}
                className="text-lg w-80 rounded-lg border border-gray-400 p-2"
                value={tableEdit.table_seat}
                placeholder="จำนวนที่นั่ง"
                min="1"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="table_price" className="font-bold text-lg w-32">
                ราคา
              </label>
              <input
                id="table_price"
                type="number"
                name="table_price"
                onChange={hdlChangeEdit}
                className="text-lg w-80 rounded-lg border border-gray-400 p-2"
                value={tableEdit.table_price}
                placeholder="ราคา"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="type_id" className="font-bold text-lg w-32">
                ประเภทโต๊ะ
              </label>
              <select
                id="typeId"
                name="typeId"
                onChange={hdlChangeEdit}
                className="text-lg w-80 rounded-lg border border-gray-400 p-2"
              >
                {tableTypes.map( (el, index) => 
                  <option value={el.type_id}>{el.type_name}</option>
                )}
              </select>
            </div>

            <button
              className="bg-green-500 hover:bg-green-600 text-white font-normal py-2 px-2 rounded-lg shadow-md transition duration-300 disabled:opacity-50"
              onClick={() => {
                handleEditClick(tableEdit.table_id)
              }}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-xs"></span> : ""} บันทึก
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
