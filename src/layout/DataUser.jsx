import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function DataUser() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      location.reload(); // ไม่แนะนำให้ใช้ location.reload() ใน React ใช้ state หรือ useEffect แทน
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

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-info drawer-button lg:hidden text-white mt-5 font-normal"
          >
            ดูข้อมูล
          </label>

          <div className="overflow-autos w-full h-screen">
            <p className="mt-3 ml-2 text-3xl font-bold ">ข้อมูลผู้ใช้</p>
            <form class="max-w-md mx-auto mr-28">
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    class="w-4 h-4 text-gray-400 dark:text-gray-400"
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
                  className="block w-96 p-3 ps-10 text-sm text- border border-gray-300 rounded-lg bg-gray-50  dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ค้นหา.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  />
                 
              </div>
            </form>
            <table className="table table-zebra mt-4">
              <thead>
                <tr className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-white">
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
              <tbody className="font-medium text-black">
                {users
                  .filter(
                    (user) =>
                      user.firstname
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.lastname
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.address
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.phone
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      (user.role === "USER" &&
                        "ผู้ใช้งาน".includes(searchTerm.toLowerCase()))
                  )
                  .filter((user) => user.role !== "ADMIN")
                  .map((user) => (
                    <tr key={user.user_id}>
                      <td>{user.user_id}</td>
                      <td>{user.firstname}</td>
                      <td>{user.lastname}</td>
                      <td>{user.address}</td>
                      <td>{user.phone}</td>
                      <td>{user.email}</td>
                      <td>{user.role === "USER" ? "ผู้ใช้งาน" : ""}</td>
                      <td>
                        <button
                          className="btn btn-error font-normal text-white text-xs shadow-xl rounded-xl"
                          onClick={() =>
                            document
                              .getElementById(`my_modal_${user.user_id}`)
                              .showModal()
                          }
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-60 min-h-full bg-sky-100 text-black">
            <li>
              <Link to="/DataUser">ข้อมูลผู้ใช้</Link>
            </li>
            <li>
              <Link to="/DataType">ข้อมูลประเภทโต๊ะ</Link>
            </li>
            <li>
              <Link to="/DataTable">ข้อมูลโต๊ะ</Link>
            </li>
            <li>
              <Link to="/DataBooking">ข้อมูลการจอง</Link>
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
            className="btn btn-error text-white"
            onClick={(e) => onDelete(e, user.user_id)}
          >
            ลบ
          </button>
        </div>
      </div>
    </dialog>
  );
};
