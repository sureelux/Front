import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
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
  const [perPage] = useState(4);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getTables = async (req, res, next) => {
      const rs = await axios.get(`http://localhost:8889/user/tables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTables(rs.data.tables);
    };
    getTables();
  }, []);

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
        const token = localStorage.getItem("token");
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
        console.error(err);
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

      const tableTypes = Array.isArray(tableTypesResponse.data.types)
        ? tableTypesResponse.data.types
        : [];
      console.log("tableTypes:", tableTypes);

      const { value: formValues } = await Swal.fire({
        title: "แก้ไขข้อมูลโต๊ะ",
        html: `
        <div class="space-y-4 mb-4">
            <div class="flex items-center space-x-4">
                <label for="table_img" class="flex-shrink-0 w-20 text-gray-700 font-medium">ภาพ</label>
                <input id="table_img" class="swal2-input border border-gray-300 rounded-md p-2 flex-grow text-lg" type="text" value="${
                  table.table_img
                }" />
            </div>
            <div class="flex items-center space-x-4">
                <label for="table_name" class="flex-shrink-0 w-20 text-gray-700 font-medium">ชื่อโต๊ะ</label>
                <input id="table_name" class="border border-gray-300 rounded-md p-2 flex-grow text-lg" type="text" value="${
                  table.table_name
                }" />
            </div>
            <div class="flex items-center space-x-4">
                <label for="table_status" class="flex-shrink-0 w-20 text-gray-700 font-medium">สถานะ</label>
                <input id="table_status" 
                       class="border border-gray-300 rounded-md p-2 flex-grow text-lg cursor-not-allowed" 
                       type="text" 
                       value="${
                         table.table_status === "FREE" ? "ว่าง" : "ไม่ว่าง"
                       }" 
                       readonly 
                       style="color: ${
                         table.table_status === "FREE" ? "green" : "red"
                       };"
                       />
            </div>
            <div class="flex items-center space-x-4">
                <label for="table_price" class="flex-shrink-0 w-20 text-gray-700 font-medium">ราคา</label>
                <input id="table_price" class="border border-gray-300 rounded-md p-2 flex-grow text-lg" type="number" value="${
                  table.table_price
                }" />
            </div>
            <div class="flex items-center space-x-4">
                <label for="type_id" class="flex-shrink-0 w-32 text-gray-700 font-medium">ประเภทโต๊ะ</label>
                <select id="type_id" class="border border-gray-300 rounded-md p-2 flex-grow text-lg">
                    ${tableTypes
                      .map(
                        (type) => `
                        <option value="${type.type_id}" ${
                          type.type_id == table.type_table?.type_id
                            ? "selected"
                            : ""
                        }>
                            ${type.type_name}
                        </option>`
                      )
                      .join("")}
                </select>
            </div>
        </div>
        `,
        focusConfirm: false,
        didOpen: () => {
          const tableStatusInput =
            Swal.getPopup().querySelector("#table_status");
          tableStatusInput.addEventListener("click", showStatusAlert);
        },
        preConfirm: () => {
          return {
            table_img: document.getElementById("table_img").value,
            table_name: document.getElementById("table_name").value,
            table_status: table.table_status,
            table_price: document.getElementById("table_price").value,
            type_id: document.getElementById("type_id").value,
          };
        },
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        showCancelButton: true,
        cancelButtonColor: "#eb3b4c",
        confirmButtonColor: "#27ba48",
        customClass: {
          confirmButton: "rounded-xl shadow-2xl",
          cancelButton: "rounded-xl shadow-2xl",
        },
      });

      if (formValues) {
        await axios.patch(
          `http://localhost:8889/admin/updateTable/${table.table_id}`,
          {
            table_img: formValues.table_img,
            table_name: formValues.table_name,
            table_status: table.table_status,
            table_price: parseInt(formValues.table_price, 10),
            type_id: formValues.type_id,
          },
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

        const rs = await axios.get(`http://localhost:8889/user/tables`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTables(rs.data.tables);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถแก้ไขข้อมูลได้",
      });
    }
  };

  function showStatusAlert() {
    Swal.fire({
      icon: "info",
      title: "สถานะ",
      text: "ไม่สามารถแก้ไขสถานะได้",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#3996fa",
    });
  }

  function FormatDate(dateString) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options);
  }

  const filteredTables = tables.filter((table) => {
    const priceString = table.table_price ? table.table_price.toString() : "";
    return (
      table.table_id.toString().includes(searchTerm.toLowerCase()) ||
      table.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      priceString.includes(searchTerm.toLowerCase()) ||
      table.type_table.type_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (table.table_status === "FREE" &&
        "ว่าง".includes(searchTerm.toLowerCase())) ||
      (table.table_status === "BUSY" &&
        "ไม่ว่าง".includes(searchTerm.toLowerCase()))
    );
  });

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
                    <th>ราคา</th>
                    <th>ประเภทโต๊ะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-black text-center">
                  {currentItems.map((tables, index) => (
                    <tr
                      key={tables.table_id}
                      tables={tables}
                      className="hover:bg-gray-100"
                    >
                      <td>{index + 1}</td>{" "}
                      <td>
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
                      <td>{tables.table_price}</td>
                      <td>{tables.type_table.type_name}</td>
                      <td>
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
                  className="bg-sky-500 text-white rounded-full px-4 py-2 hover:bg-sky-600 disabled:bg-sky-300 text-sm"
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
                  className="bg-sky-500 text-white rounded-full px-4 py-2 hover:bg-sky-600 disabled:bg-sky-300 text-sm"
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
                to="/Dashboard"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/Dashboard")
                    ? "bg-black text-white font-bold"
                    : "bg-opacity-55 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />{" "}
                แดชบอร์ด
              </Link>
            </li>
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
                  isActive("/DataBooking")
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
