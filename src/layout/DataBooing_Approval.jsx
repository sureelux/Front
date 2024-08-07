import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faCheck,
  faTimes,
  faUser,
  faTable,
  faClipboardList,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";

export default function DataBooking_Approval() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);

  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8889/admin/bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(response.data.bookings);

        const datesResponse = await axios.get(
          "http://localhost:8889/admin/availableDates",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAvailableDates(datesResponse.data.dates);
      } catch (error) {
        console.error("Error fetching bookings or available dates:", error);
      }
    };
    getBookings();
  }, [token]);

  const hdlDelete = async (e, booking_id) => {
    try {
      e.stopPropagation();
      await axios.delete(
        `http://localhost:8889/admin/deleteBooking/${booking_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(
        bookings.filter((booking) => booking.booking_id !== booking_id)
      );
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  const handleStatusChange = async (e, booking_id, currentStatus) => {
    e.stopPropagation();

    if (currentStatus !== "APPROVE") {
      Swal.fire({
        title: "ไม่สามารถยกเลิกการจองได้",
        text: "การจองนี้ไม่อยู่ในสถานะที่สามารถยกเลิกได้",
        icon: "info",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    Swal.fire({
      title: "คุณต้องการยกเลิกการจองไหม?",
      text: "การยกเลิกจะทำให้สถานะการจองเป็น 'ยกเลิก'",
      icon: "warning",
      showCloseButton: true,
      confirmButtonColor: "#02ab21",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.patch(
            `http://localhost:8889/admin/updateStatusBooking/${booking_id}`,
            { status_booking: "CANCEL" },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200) {
            Swal.fire({
              title: "ยกเลิกเรียบร้อย",
              text: "สถานะการจองถูกเปลี่ยนเป็นยกเลิก",
              icon: "success",
              confirmButtonText: "ตกลง",
              confirmButtonColor: "#3085d6",
            }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถยกเลิกการจองได้", "error");
          }
        } catch (err) {
          console.error(
            "Error updating booking status:",
            err.response ? err.response.data : err.message
          );
          Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถยกเลิกการจองได้", "error");
        }
      }
    });
  };

  function FormatDate(dateString) {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formatter.format(date);
  }

  function formatISODateToThai(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear() + 543;
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  const extractUniqueDates = (bookings) => {
    const dates = bookings
      .filter((booking) => booking.status_booking === "WAIT")
      .map(
        (booking) =>
          new Date(booking.booking_datatime).toISOString().split("T")[0]
      );

    const uniqueDates = [...new Set(dates)];

    const sortedDates = uniqueDates
      .map((date) => new Date(date))
      .sort((a, b) => a - b)
      .map((date) => date.toISOString().split("T")[0]);

    return sortedDates;
  };

  const uniqueDates = extractUniqueDates(bookings);

  const filteredBookings_Approval = bookings.filter((booking) => {
    const searchTermLower = searchTerm.trim().toLowerCase();
    const thaiStatusMapping = {
      APPROVE: "อนุมัติ",
      CANCEL: "ยกเลิก",
    };

    const formattedDateTime = new Date(booking.booking_datatime)
      .toLocaleString("th-TH")
      .toLowerCase();

    const bookingDate = new Date(booking.booking_datatime)
      .toISOString()
      .split("T")[0];

    return (
      (selectedDate === "" || selectedDate === bookingDate) &&
      (booking.table.table_name.toLowerCase().includes(searchTermLower) ||
        booking.table.type_table.type_name
          .toLowerCase()
          .includes(searchTermLower) ||
        booking.user.firstname.toLowerCase().includes(searchTermLower) ||
        thaiStatusMapping[booking.status_booking].includes(searchTermLower) ||
        formattedDateTime.includes(searchTermLower))
    );
  });

  const handleClear = () => {
    setSelectedDate("");
  };

  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredBookings_Approval.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredBookings_Approval.length / perPage)) {
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
    canceled: bookings.filter((b) => b.status_booking === "CANCEL").length,
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
            <p className="mt-3 ml-2 text-3xl font-bold drop-shadow-lg">
              รายละเอียดข้อมูลการจอง (รออนุมัติ)
            </p>
            <hr className="border my-3 ml-10 border-sky-400 dark:border-sky-300" />

            <div className="flex justify-between items-center mb-4">
              <div className="ml-4 flex items-center space-x-2">
                <label
                  htmlFor="date-filter"
                  className="text-sm font-bold text-gray-700 dark:text-gray-300"
                >
                  เลือกวันที่
                </label>
                <select
                  id="date-filter"
                  className="select select-bordered select-sm w-full max-w-xs max-h-48 overflow-auto"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="">ทั้งหมด</option>
                  {uniqueDates.map((date, index) => (
                    <option key={index} value={date}>
                      {FormatDate(date)}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="px-2 py-1 text-sm font-medium text-gray-900 bg-gray-200 border border-gray-400 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
                  onClick={handleClear}
                >
                  ล้าง
                </button>
              </div>

              <div className="flex items-center mt-8 mr-5">
                <label
                  htmlFor="default-search"
                  className="text-sm font-bold text-gray-700 dark:text-gray-300 mr-2"
                >
                  ค้นหา :
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

            {filteredBookings_Approval.length > 0 ? (
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
                  {currentItems
                    .filter((booking) => booking.status_booking === "WAIT")
                    .map((booking, index) => (
                      <tr
                        key={booking.booking_id}
                        className="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <td>{index + 1 + indexOfFirstItem}</td>
                        <td>{formatISODateToThai(booking.booking_datatime)}</td>
                        <td>{booking.table.table_name}</td>
                        <td>{booking.table.type_table.type_name}</td>
                        <td>{booking.table.table_price}</td>
                        <td>{booking.user.firstname}</td>
                        <td className="text-yellow-400 font-medium">
                          รออนุมัติ
                        </td>
                        <td>
                          <button
                            className={`btn ${
                              booking.status_booking === "WAIT"
                                ? "btn-warning"
                                : ""
                            } text-xs rounded-2xl shadow-xl`}
                            onClick={() =>
                              document
                                .getElementById(
                                  `my_modal_${booking.booking_id}`
                                )
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
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
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
                  ไม่พบข้อมูลการจอง
                </p>
              </div>
            )}

            {filteredBookings_Approval.length > perPage && (
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
                  {Math.ceil(filteredBookings_Approval.length / perPage)}
                </span>
                <button
                  className="bg-sky-500 text-white rounded-full px-4 py-2 hover:bg-sky-600 disabled:bg-sky-300 text-xs"
                  onClick={nextPage}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredBookings_Approval.length / perPage)
                  }
                >
                  ถัดไป
                </button>
              </div>
            )}

            {filteredBookings_Approval.map((booking, index) => (
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
        alert("คุณได้ทำการอนุมัติการจองเรียบร้อยแล้ว");
        document.getElementById(modalId).close();
        window.location.href = "/DataBooking";
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const hdlModalCancel = async (modalId, tableId, bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const data = { table_status: "FREE" };
      const data2 = { status_booking: "CANCEL" };
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
        alert("คุณได้ทำการยกเลิกการจองเรียบร้อยแล้ว");
        document.getElementById(modalId).close();
        window.location.href = "/DataBooking";
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
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
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
            ยกเลิก
          </button>
        </div>
      </div>
    </dialog>
  );
};
