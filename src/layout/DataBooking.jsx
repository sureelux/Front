import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faCheck,
  faTimes,
  faUser,
  faTable,
  faClipboardList,
  faCalendarCheck,
  faCheckCircle,
  faHourglassHalf,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'; 

export default function DataBooking() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(6);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getBookings = async () => {
      try {
        const rs = await axios.get(`http://localhost:8889/admin/bookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }  
        );
        setBookings(rs.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    getBookings();
  }, []);

  const hdlDelete = async (e, booking_id) => {
    try {
      e.stopPropagation();
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8889/admin/deleteBooking/${booking_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      location.reload();
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

  const filteredBookings = bookings.filter((booking) => {
    const searchTermLower = searchTerm.trim().toLowerCase();
    const thaiStatusMapping = {
      APPROVE: "อนุมัติ",
      NOT_APPROVED: "ไม่อนุมัติ",
      WAIT: "รออนุมัติ",
    };

    const formattedDateTime = new Date(booking.booking_datatime)
      .toLocaleString("th-TH")
      .toLowerCase();

    return (
      booking.table.table_name.toLowerCase().includes(searchTermLower) ||
      booking.table.type_table.type_name
        .toLowerCase()
        .includes(searchTermLower) ||
      booking.user.firstname.toLowerCase().includes(searchTermLower) ||
      thaiStatusMapping[booking.status_booking].includes(searchTermLower) ||
      formattedDateTime.includes(searchTermLower)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredBookings.length / perPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const counts = {
    approved: bookings.filter((b) => b.status_booking === "APPROVE").length,
    pending: bookings.filter((b) => b.status_booking === "WAIT").length,
    canceled: bookings.filter((b) => b.status_booking === "NOT_APPROVED")
      .length,
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="">
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
              รายละเอียดข้อมูลการจอง
            </p>
            <hr className="border my-3 ml-10 border-sky-400 dark:border-sky-300" />
            <div className="flex space-x-4 mb-10 mt-5 w-full px-4">
              <div className="p-4 bg-green-200 rounded-lg shadow-md flex-1">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-600 mr-2"
                  />
                  <h2 className="text-xl font-semibold text-green-600">
                    อนุมัติ
                  </h2>
                </div>
                <p className="text-3xl font-bold">{counts.approved}</p>
              </div>
              <div className="p-4 bg-yellow-200 rounded-lg shadow-md flex-1">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faHourglassHalf}
                    className="text-yellow-600 mr-2"
                  />
                  <h2 className="text-xl font-semibold text-yellow-600">
                    รออนุมัติ
                  </h2>
                </div>
                <p className="text-3xl font-bold">{counts.pending}</p>
              </div>
              <div className="p-4 bg-red-200 rounded-lg shadow-md flex-1">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    className="text-red-600 mr-2"
                  />
                  <h2 className="text-xl font-semibold text-red-600">ยกเลิก</h2>
                </div>
                <p className="text-3xl font-bold">{counts.canceled}</p>
              </div>
            </div>

            <form className="max-w-md mx-auto mr-28">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none space-x-2">
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
                  className="block w-96 p-2 ps-10 text-sm text- border border-gray-500 rounded-lg bg-gray-50  dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ค้นหา"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            {filteredBookings.length > 0 ? (
              <table className="table mt-2">
                <thead>
                  <tr className="text-sm text-black uppercase bg-gradient-to-r from-sky-400 to-cyan-300 text-center">
                    <th>ลำดับ</th>
                    <th>วันที่/เวลาจอง</th>
                    <th>ชื่อโต๊ะ</th>
                    <th>ประเภทโต๊ะ</th>
                    <th>ราคาโต๊ะ</th>
                    <th>ชื่อลูกค้า</th>
                    <th>สถานะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-black text-center">
                  {currentItems.map((bookings, index) => (
                    <tr
                      key={bookings.booking_id}
                      bookings={bookings}
                      className="hover:bg-gray-100"
                    >
                      <td>{bookings.booking_id}</td>
                      <td>
                        {new Date(bookings.booking_datatime).toLocaleString(
                          "th-TH"
                        )}
                      </td>
                      <td>{bookings.table.table_name}</td>
                      <td>{bookings.table.type_table.type_name}</td>
                      <td>{bookings.table.table_price}</td>
                      <td>{bookings.user.firstname}</td>
                      <td
                        className={
                          bookings.status_booking === "APPROVE"
                            ? "text-green-500"
                            : bookings.status_booking === "NOT_APPROVED"
                            ? "text-red-500 font-medium"
                            : bookings.status_booking === "WAIT"
                            ? "text-yellow-400 font-medium"
                            : ""
                        }
                      >
                        {bookings.status_booking === "APPROVE"
                          ? "อนุมัติ"
                          : bookings.status_booking === "NOT_APPROVED"
                          ? "ไม่อนุมัติ"
                          : bookings.status_booking === "WAIT"
                          ? "รออนุมัติ"
                          : ""}
                      </td>
                      <td>
                        <button
                          className={`${
                            bookings.status_booking === "APPROVE"
                              ? "btn btn-success text-xs rounded-2xl shadow-xl"
                              : bookings.status_booking === "NOT_APPROVED"
                              ? "btn btn-error text-xs rounded-2xl shadow-xl"
                              : "btn btn-warning text-xs rounded-2xl shadow-xl"
                          }`}
                          onClick={() =>
                            document
                              .getElementById(`my_modal_${bookings.booking_id}`)
                              .showModal()
                          }
                        >
                          <svg
                            className="w-4 h-4 text-white"
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
                              d="M5 1v3m5-3v3m5-3v3M1 7h7m1.506 3.429 2.065 2.065M19 7h-2M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Zm6 13H6v-2l5.227-5.292a1.46 1.46 0 0 1 2.065 2.065L8 16Z"
                            />
                          </svg>
                        </button>
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
                      <th>วันที่/เวลา</th>
                      <th>ชื่อโต๊ะ</th>
                      <th>ประเภทโต๊ะ</th>
                      <th>ชื่อลูกค้า</th>
                      <th>สถานะ</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>
                </table>
                <p className="text-center text-xl font-bold text-gray-500 mt-10">
                  ไม่พบข้อมูล
                </p>
              </div>
            )}
            {filteredBookings.length > perPage && (
              <nav className="flex justify-center space-x-2 mt-1">
                {/* Previous page button */}
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

                {/* Numbered pages */}
                {[...Array(Math.ceil(filteredBookings.length / perPage))].map(
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
                    currentPage === Math.ceil(filteredBookings.length / perPage)
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200"
                  } btn btn-sm rounded-full px-3 py-1 shadow-sm`}
                  onClick={nextPage}
                  disabled={
                    currentPage === Math.ceil(filteredBookings.length / perPage)
                  }
                >
                  {">"}
                </button>
              </nav>
            )}

            {bookings.map((booking, index) => (
              <Modal key={index} booking={booking} />
            ))}
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
    </div>
  );
}

const Modal = ({ booking }) => {
  const modalId = `my_modal_${booking.booking_id}`;
  let token = localStorage.getItem("token");

  const hdlModalAccept = async (modalId, tableId, bookingId) => {
    try {
      const data = { table_status: "BUSY" };
      const data2 = { status_booking: "APPROVE" };
      const rs = await axios.patch(
        `http://localhost:8889/admin/updateStatus/${tableId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        } 
      );
      const rs2 = await axios.patch(
        `http://localhost:8889/admin/updateStatusBooking/${bookingId}`,
        data2,
        {
          headers: { Authorization: `Bearer ${token}` },
        } 
      );
      if (rs2.status === 200 && rs.status === 200) {
        alert("คุณได้ทำการอนุมัติเรียบร้อยแล้ว");
        document.getElementById(modalId).close();
        location.reload();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const hdlModalCancel = async (modalId, tableId, bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const data = { table_status: "FREE" };
      const data2 = { status_booking: "NOT_APPROVED" };
      const rs = await axios.patch(
        `http://localhost:8889/admin/updateStatus/${tableId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }  
      );
      const rs2 = await axios.patch(
        `http://localhost:8889/admin/updateStatusBooking/${bookingId}`,
        data2,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (rs2.status === 200) {
        alert("คุณได้ทำการไม่อนุมัติเรียบร้อยแล้ว");
        document.getElementById(modalId).close();
        location.reload();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 border bg-red-500 text-white">
            ✕
          </button>
        </form>
        <svg
          className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-red-200"
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
            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <h3 className="font-bold text-xl text-center">
          คุณต้องการอนุมัติการจองหรือไม่?
        </h3>
        <div className="mt-8 flex justify-center">
          <button
            className="btn btn-success text-white font-normal mr-5 rounded-xl"
            onClick={() =>
              hdlModalAccept(
                modalId,
                booking.table.table_id,
                booking.booking_id
              )
            }
          >
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            อนุมัติ
          </button>
          <button
            className="btn btn-error text-white font-normal rounded-xl"
            onClick={() =>
              hdlModalCancel(
                modalId,
                booking.table.table_id,
                booking.booking_id
              )
            }
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            ไม่อนุมัติ
          </button>
        </div>
      </div>
    </dialog>
  );
};
