import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faUser,
  faTable,
  faClipboardList,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function DataUser() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(7); // Number of items per page

  useEffect(() => {
    const getUsers = async () => {
      try {
        const rs = await axios.get("http://localhost:8889/admin/users");
        setUsers(rs.data.users);
      } catch (err) {
        console.error(err);
      }
    };
    getUsers();
  }, []);

  const hdlDelete = async (e, user_id) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8889/admin/deleteUser/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.user_id !== user_id));
      alert("คุณได้ลบข้อมูลผู้ใช้เรียบร้อยแล้ว");
    } catch (err) {
      console.error(err);
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

  const filteredUsers = users
    .filter(
      (user) =>
        user.user_id.toString().includes(searchTerm.toLowerCase()) ||
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.role === "USER" && "ผู้ใช้งาน".includes(searchTerm.toLowerCase()))
    )
    .filter((user) => user.role !== "ADMIN");
    
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / perPage)) {
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
              รายละเอียดข้อมูลผู้ใช้
            </p>
            <hr className="border my-5 ml-10 border-sky-400 dark:border-sky-300" />
            <form className="max-w-md mx-auto mr-28">
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
                  className="block w-96 p-2 ps-10 text-sm border border-gray-400 rounded-lg bg-gray-50 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ค้นหา"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            {notification && (
              <p className="text-center text-green-500 mt-4">{notification}</p>
            )}
            {filteredUsers.length > 0 ? (
              <table className="table mt-4">
                <thead>
                  <tr className="text-sm text-black uppercase bg-gradient-to-r from-sky-400 to-cyan-300 text-center">
                    <th>ลำดับ</th>
                    <th>ชื่อ</th>
                    <th>นามสกุล</th>
                    <th>ที่อยู่</th>
                    <th>เบอร์โทรศัพท์</th>
                    <th>อีเมล</th>
                    <th>ตำแหน่ง</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-black text-center">
                  {currentItems.map((user, index) => (
                    <tr key={user.user_id} className="hover:bg-gray-100">
                      <td>{user.user_id}</td>
                      <td>{user.firstname}</td>
                      <td>{user.lastname}</td>
                      <td>{user.address}</td>
                      <td>{user.phone}</td>
                      <td>{user.email}</td>
                      <td>{user.role === "USER" ? "ผู้ใช้งาน" : ""}</td>
                      <td>
                        <div className="justify-center items-center">
                          <button
                            className="btn btn-error font-normal text-white text-xs shadow-xl rounded-xl"
                            onClick={() =>
                              document
                                .getElementById(`my_modal_${user.user_id}`)
                                .showModal()
                            }
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
                      <th>ชื่อ</th>
                      <th>นามสกุล</th>
                      <th>ที่อยู่</th>
                      <th>เบอร์โทรศัพท์</th>
                      <th>อีเมล</th>
                      <th>ตำแหน่ง</th>
                      <th>ตัวเลือก</th>
                    </tr>
                  </thead>
                </table>
                <p className="text-center text-xl font-bold text-gray-500 mt-10">
                  ไม่พบข้อมูล
                </p>
              </div>
            )}
              {filteredUsers.length > perPage && (
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
            {[...Array(Math.ceil(filteredUsers.length / perPage))].map(
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
                currentPage === Math.ceil(filteredUsers.length / perPage)
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200"
              } btn btn-sm rounded-full px-3 py-1 shadow-sm`}
              onClick={nextPage}
              disabled={currentPage === Math.ceil(filteredUsers.length / perPage)}
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
                <FontAwesomeIcon icon={faTable} className="mr-2" />{" "}
                ข้อมูลประเภทโต๊ะ
              </Link>
            </li>
            <li>
              <Link to="/DataTable">
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />{" "}
                ข้อมูลโต๊ะ
              </Link>
            </li>
            <li>
              <Link to="/DataBooking">
                <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />{" "}
                ข้อมูลการจอง
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {users.map((user) => (
        <Modal key={user.user_id} user={user} onDelete={hdlDelete} />
      ))}
    </div>
  );
}

const Modal = ({ user, onDelete }) => {
  const modalId = `my_modal_${user.user_id}`;

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">คุณต้องการลบข้อมูลหรือไม่?</h3>
        <div className="modal-action">
          <button
            className="btn"
            onClick={() => document.getElementById(modalId).close()}
          >
            ยกเลิก
          </button>
          <button
            className="btn btn-error text-white font-normal"
            onClick={(e) => onDelete(e, user.user_id)}
          >
            ลบ
          </button>
        </div>
      </div>
    </dialog>
  );
};
