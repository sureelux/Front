import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function DataTable() {
  const [tables, setTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(4); // Number of items per page

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getTables = async (req, res, next) => {
      const rs = await axios.get(`http://localhost:8889/user/tables`,
        {
          headers: { Authorization: `Bearer ${token}` },
        } 
      );
      setTables(rs.data.tables);
    };
    getTables();
  }, []);

  const hdlDelete = async (e, table_id) => {
    try {
      e.stopPropagation();
      const token = localStorage.getItem("token");
      const rs = await axios.delete(
        `http://localhost:8889/admin/deleteTable/${table_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("คุณได้ลบข้อมูลโต๊ะเรียบร้อยแล้ว"); // Show alert after successful deletion
      location.reload();
      setTrigger((prv) => !prv);
    } catch (err) {
      console.log(err);
    }
  };

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
            <div className="flex flex-col items-center max-w-md mx-auto mr-28">
              <form className="w-full">
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="default-search"
                    className="block w-96 p-2 ps-10 text-sm text- border border-gray-500 rounded-lg bg-gray-50 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="ค้นหา"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
              <div className="mt-1 ml-96">
                <Link
                  className="btn btn-success drawer-button text-white font-normal rounded-xl shadow-xl"
                  to="/CreateTable"
                >
                  <FontAwesomeIcon icon={faPlus} className="" />
                </Link>
              </div>
            </div>
            {/* {JSON.stringify(tables)} */}
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
                      <td>{tables.table_id}</td>
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
                            onClick={() =>
                              document
                                .getElementById(`my_modal_${tables.table_id}`)
                                .showModal()
                            }
                          >
                            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                          </button>

                          <button
                            className="btn btn-error text-white text-xs font-normal rounded-xl shadow-xl"
                            onClick={() =>
                              document.getElementById("my_modal_1").showModal()
                            }
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                          <dialog id="my_modal_1" className="modal">
                            <div className="modal-box">
                              <h3 className="font-bold text-lg">
                                คุณต้องการลบข้อมูลหรือไม่?
                              </h3>
                              <div className="modal-action">
                                <button
                                  className="btn"
                                  onClick={() =>
                                    document
                                      .getElementById("my_modal_1")
                                      .close()
                                  }
                                >
                                  ยกเลิก
                                </button>
                                <button
                                  className="btn btn-error text-white"
                                  onClick={(e) => hdlDelete(e, tables.table_id)}
                                >
                                  ลบ
                                </button>
                              </div>
                            </div>
                          </dialog>
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
                  ไม่พบข้อมูล
                </p>
              </div>
            )}
            {filteredTables.length > perPage && (
          <nav className="flex justify-center space-x-2 mt-1">
            <button
              className={`${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200"
              } btn btn-sm rounded-full px-3 py-1 shadow-sm`}
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
            {[...Array(Math.ceil(filteredTables.length / perPage))].map(
              (item, index) => (
                <button
                  key={index}
                  className={`${
                    currentPage === index + 1
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200"
                  } btn btn-sm rounded-full px-3 py-1 shadow-sm`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              )
            )}

            {/* Next page button */}
            <button
              className={`${
                currentPage === Math.ceil(filteredTables.length / perPage)
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200"
              } btn btn-sm rounded-full px-3 py-1 shadow-sm`}
              onClick={nextPage}
              disabled={currentPage === Math.ceil(filteredTables.length / perPage)}
            >
              {">"}
            </button>
          </nav>
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
              <Link to="/DataUser">
                <FontAwesomeIcon icon={faUser} className="mr-2" /> ข้อมูลผู้ใช้
              </Link>
            </li>
            <li>
              <Link to="/DataType">
                <FontAwesomeIcon icon={faTable} className="mr-2" />
                ข้อมูลประเภทโต๊ะ
              </Link>
            </li>
            <li>
              <Link to="/DataTable">
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                ข้อมูลโต๊ะ
              </Link>
            </li>
            <li>
              <Link to="/DataBooking">
                <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                ข้อมูลการจอง
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {tables.map((table, index) => (
        <Modal key={index} table={table} />
      ))}
    </div>
  );
}
const Modal = ({ table }) => {
  const modalId = `my_modal_${table.table_id}`;
  console.log(modalId);
  const [editData, setEditData] = useState({
    table_img: "",
    table_name: "",
    table_status: "",
    table_price: "",
  });
  const [isEditing, setEditing] = useState(false);

  const handleEditCilck = () => {
    setEditData({ ...table });
    setEditing(true);
  };

  const handleSaveClick = async (e) => {
    setEditing(false);
    try {
      e.stopPropagation();
      const table_id = table.table_id;

      const apiUrl = `http://localhost:8889/admin/updateTable/${table_id}`;

      const token = localStorage.getItem("token"); 
      await axios.patch(apiUrl, editData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert("คุณทำการแก้ไขข้อมูลเรียบร้อย");
      location.reload();
      setEditing(false);
      document.getElementById(modalId).close();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล", error);
    }
  };

  const handleChange = (e) => {
    setEditData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <dialog id={modalId} className="modal">
      {console.log(modalId)}
      <div className="modal-box p-10">
        <h3 className="font-bold text-2xl mb-5">แก้ไขข้อมูลโต๊ะ</h3>
        <h3 className="text-lg mb-5 font-bold">
          ภาพ :{" "}
          {isEditing ? (
            <input
              className="border border-gray-400  pl-3 pr-3 py-1 rounded-lg font-normal shadow-sm w-80 ml-7"
              type="text"
              name="table_img"
              value={editData.table_img}
              onChange={handleChange}
            ></input>
          ) : (
            table.table_img
          )}
        </h3>
        <h3 className="text-lg mb-5 font-bold">
          ชื่อโต๊ะ :{" "}
          {isEditing ? (
            <input
              className="border border-gray-400 pl-3 pr-3 py-1 rounded-lg font-normal shadow-sm w-80 ml-2"
              type="text"
              name="table_name"
              value={editData.table_name}
              onChange={handleChange}
            ></input>
          ) : (
            table.table_name
          )}
        </h3>
        <h3 className="text-lg mb-5 font-bold">
          สถานะ :{" "}
          {isEditing ? (
            <input
              className="border border-gray-400 pl-3 pr-3 py-1 rounded-lg font-normal shadow-sm w-80 ml-1"
              type="text"
              name="table_status"
              value={editData.table_status}
              onChange={handleChange}
            ></input>
          ) : (
            table.table_status
          )}
        </h3>
        <h3 className="text-lg mb-5 font-bold">
          ราคา :{" "}
          {isEditing ? (
            <input
              className="border border-gray-400 pl-3 pr-3 py-1 rounded-lg font-normal shadow-sm w-80 ml-5"
              type="text"
              name="table_price"
              value={editData.table_price}
              onChange={handleChange}
            ></input>
          ) : (
            table.table_price
          )}
        </h3>

        <div className="flex justify-end mt-5">
          {isEditing ? (
            <div className="space-x-4">
              <button
                className=" btn btn-accent text-white font-normal rounded-3xl"
                onClick={handleSaveClick}
              >
                บันทึก
              </button>
              <button
                className=" btn btn-error rounded-3xl text-white font-normal"
                onClick={() => document.getElementById(modalId).close()}
              >
                ยกเลิก
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <button
                className=" btn btn-warning rounded-3xl text-white font-normal"
                onClick={handleEditCilck}
              >
                แก้ไข
              </button>
              <button
                className=" btn btn-error rounded-3xl text-white font-normal"
                onClick={() => document.getElementById(modalId).close()}
              >
                ยกเลิก
              </button>
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => document.getElementById(modalId).close()}>
          Close
        </button>
      </form>
    </dialog>
  );
};
