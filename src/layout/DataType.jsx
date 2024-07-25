import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function DataType() {
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(4);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getTypes = async () => {
      const rs = await axios.get(`http://localhost:8889/admin/types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTypes(rs.data.types);
    };
    getTypes();
  }, []);

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

  const filteredTypes = types.filter(
    (type) =>
      type.type_id.toString().includes(searchTerm.toLowerCase()) ||
      type.type_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredTypes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredTypes.length / perPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const hdlDelete = async (e, type_id) => {
    e.preventDefault();  

        const result = await Swal.fire({
        title: 'คุณต้องการลบข้อมูลหรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก'
      });
  
      if (result.isConfirmed) {
        try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8889/admin/deleteType/${type_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setTypes(types.filter((type) => type.type_id !== type_id));
  
        Swal.fire({
          icon: 'success',
          title: 'ลบข้อมูลเรียบร้อย',
          confirmButtonColor: '#3996fa',
        });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาดในการลบข้อมูล',
        text: err.message,
        confirmButtonColor: '#3996fa',
      });
    }
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
          <div className="overflow-auto w-full h-screen mt-15">
            <p className="mt-3 ml-2 text-3xl font-bold drop-shadow-md shadow-gray-300">
              รายละเอียดข้อมูลประเภทโต๊ะ
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
                    className="block w-96 p-2 ps-10 text-sm border border-gray-500 rounded-lg bg-gray-50 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="ค้นหา"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
              <div className="mt-2 ml-96">
                <Link
                  className="btn btn-success text-white font-normal rounded-xl shadow-xl flex items-center"
                  to="/CreateType"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                </Link>
              </div>
            </div>
            {filteredTypes.length > 0 ? (
              <table className="table mt-2">
                <thead>
                  <tr className="text-sm text-black uppercase bg-gradient-to-r from-sky-400 to-cyan-300 text-center">
                    <th>ลำดับ</th>
                    <th>ประเภท</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-black text-center">
                  {currentItems.map((type, index) => (
                    <tr
                      key={type.type_id}
                      className="hover:bg-gray-100"
                    >
                      <td>{type.type_id}</td>
                      <td>{type.type_name}</td>
                      <td>
                        <div className="flex justify-center items-center">
                          <button
                            className="btn btn-warning text-black text-xs font-normal rounded-xl shadow-xl flex items-center mr-2"
                            onClick={() =>
                              document
                                .getElementById(`my_modal_${type.type_id}`)
                                .showModal()
                            }
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-1" />
                          </button>
                          <button
                            className="btn btn-error text-white text-xs font-normal rounded-xl shadow-xl flex items-center"
                            onClick={(e) => hdlDelete(e, type.type_id)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-1" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>
                <table className="table table-zebra mt-2">
                  <thead>
                    <tr className="text-sm text-black uppercase bg-gradient-to-r from-sky-400 to-cyan-300 text-center">
                      <th>ลำดับ</th>
                      <th>ประเภท</th>
                      <th>การดำเนินการ</th>
                    </tr>
                  </thead>
                </table>
                <p className="text-center text-xl font-bold text-gray-500 mt-10">
                  ไม่พบข้อมูล
                </p>
              </div>
            )}
            {filteredTypes.length > perPage && (
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

                {[...Array(Math.ceil(filteredTypes.length / perPage))].map(
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

                <button
                  className={`${
                    currentPage === Math.ceil(filteredTypes.length / perPage)
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200"
                  } btn btn-sm rounded-full px-3 py-1 shadow-sm`}
                  onClick={nextPage}
                  disabled={currentPage === Math.ceil(filteredTypes.length / perPage)}
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
            <Link to="/Dashboard"
             className={`flex items-center p-2 rounded-lg ${isActive("/Dashboard") ? "bg-black text-white font-bold" : "bg-opacity-55 text-black"}`}
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />{" "}
              แดชบอร์ด
            </Link>
          </li>
          <li>
            <Link to="/DataUser"
            className={`flex items-center p-2 rounded-lg ${isActive("/DataUser") ? "bg-black text-white font-bold" : "bg-opacity-55 text-black"}`}>
              <FontAwesomeIcon icon={faUser} className="mr-2" /> ข้อมูลผู้ใช้
            </Link>
          </li>
          <li>
            <Link to="/DataType"
            className={`flex items-center p-2 rounded-lg ${isActive("/DataType") ? "bg-black text-white font-bold" : "bg-opacity-55 text-black"}`}>
              <FontAwesomeIcon icon={faTable} className="mr-2" />
              ข้อมูลประเภทโต๊ะ
            </Link>
          </li>
          <li>
            <Link to="/DataTable"
            className={`flex items-center p-2 rounded-lg ${isActive("/DataTable") ? "bg-black text-white font-bold" : "bg-opacity-55 text-black"}`}>
              <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
              ข้อมูลโต๊ะ
            </Link>
          </li>
          <li>
            <Link to="/DataBooking"
            className={`flex items-center p-2 rounded-lg ${isActive("/DataBooking") ? "bg-black text-white font-bold" : "bg-opacity-55 text-black"}`}>
              <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
              ข้อมูลการจอง
            </Link>
          </li>
          </ul>
        </div>
      </div>
      {types.map((type, index) => (
        <Modal key={index} type={type} />
      ))}
    </div>
  );
}

const Modal = ({ type }) => {
  const modalId = `my_modal_${type.type_id}`;
  const [editData, setEditData] = useState({
    type_name: "",
  });
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    setEditData({ ...type });
  }, [type]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    try {
      const apiUrl = `http://localhost:8889/admin/updateType/${type.type_id}`;
      const token = localStorage.getItem("token");
      await axios.patch(apiUrl, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("คุณทำการแก้ไขข้อมูลเรียบร้อย");
      document.getElementById(modalId).close();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล", error);
    } finally {
      setEditing(false);
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
      <div className="modal-box p-12">
        <h3 className="font-bold mb-5 text-2xl">แก้ไขข้อมูลประเภทโต๊ะ</h3>
        <h3 className="text-lg font-bold">
          ประเภท :{" "}
          {isEditing ? (
            <input
              className="border border-gray-400 pl-3 rounded-lg font-normal shadow-sm w-80"
              type="text"
              name="type_name"
              value={editData.type_name}
              onChange={handleChange}
            ></input>
          ) : (
            type.type_name
          )}
        </h3>
        <div className="flex justify-end mt-5">
          {isEditing ? (
            <div className="flex space-x-4">
              <button
                className="btn btn-accent text-white rounded-3xl font-normal"
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
            <div className="flex space-x-4">
              <button
                className=" btn btn-warning rounded-3xl text-white font-normal flex items-center"
                onClick={handleEditClick}
              >
                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                แก้ไข
              </button>
              <button
                className=" btn btn-error rounded-3xl text-white font-normal flex items-center"
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
