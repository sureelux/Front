import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faTimes,
  faUser,
  faTable,
  faClipboardList,
  faCalendarCheck,
  faList
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";

export default function DataBooking() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [counts, setCounts] = useState({ approved: 0, canceled: 0 });
  const [filterStatus, setFilterStatus] = useState(null);

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

        // Count status bookings
        setCounts({
          approved: response.data.bookings.filter(
            (b) => b.status_booking === "APPROVE"
          ).length,
          canceled: response.data.bookings.filter(
            (b) => b.status_booking === "CANCEL"
          ).length,
        });
      } catch (error) {
        console.error("Error fetching bookings:", error);
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
      await getBookings();
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
      showCancelButton: true,
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
              getBookings();
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
      .filter(
        (booking) =>
          booking.status_booking === "APPROVE" ||
          booking.status_booking === "CANCEL"
      )
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

  const filteredBookings = bookings.filter((booking) => {
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

  const handleFilter = (status) => {
    setFilterStatus(status);
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
          <div className="overflow-auto w-full h-screen mt-15">
            <p className="mt-3 ml-2 text-3xl font-bold drop-shadow-[2px_2px_var(--tw-shadow-color)] shadow-gray-300">
              รายละเอียดข้อมูลการจอง
            </p>
            <hr className="border my-3 ml-10 border-sky-400 dark:border-sky-300" />
            <div className="flex justify-start gap-4 mt-1 p-4">
              <div
                className="flex items-center p-4 border-2 border-gray-500 rounded-lg shadow-md bg-gray-50 cursor-pointer"
                onClick={() => handleFilter(null)}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 text-white">
                  <FontAwesomeIcon icon={faList} size="lg" />
                </div>
                <div className="ml-4">
                <p className="text-lg font-medium">ทั้งหมด</p>
                <p className="text-gray-600">ข้อมูลทั้งหมด : {counts.approved + counts.canceled}</p>
                </div>
              </div>
              <div
                className="flex items-center p-4 border-2 border-green-500 rounded-lg shadow-md bg-green-50 cursor-pointer"
                onClick={() => handleFilter("APPROVE")}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white">
                  <FontAwesomeIcon icon={faCalendarCheck} size="lg" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">อนุมัติ</p>
                  <p className="text-gray-600">ข้อมูลอนุมัติทั้งหมด : {counts.approved}</p>
                </div>
              </div>
              <div
                className="flex items-center p-4 border-2 border-red-500 rounded-lg shadow-md bg-red-50 cursor-pointer"
                onClick={() => handleFilter("CANCEL")}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white">
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">ยกเลิก</p>
                  <p className="text-gray-600">ข้อมูลยกเลิกทั้งหมด : {counts.canceled}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="ml-4 flex items-center space-x-2">
                <label
                  htmlFor="date-filter"
                  className="text-sm font-bold text-gray-700 dark:text-gray-300 "
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
                  {currentItems
                    .filter((booking) => {
                      if (filterStatus === "APPROVE") {
                        return booking.status_booking === "APPROVE";
                      } else if (filterStatus === "CANCEL") {
                        return booking.status_booking === "CANCEL";
                      } else { return booking.status_booking === "APPROVE" || booking.status_booking === "CANCEL";
                      }
                    })
                    .map((booking, index) => (
                      <tr
                        key={booking.booking_id}
                        className="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-900"
                      >
                        <td className="py-4 px-6">
                          {index + 1 + indexOfFirstItem}
                        </td>
                        <td className="py-4 px-6">
                          {formatISODateToThai(booking.booking_datatime)}
                        </td>
                        <td className="py-4 px-6">
                          {booking.table.table_name}
                        </td>
                        <td className="py-4 px-6">
                          {booking.table.type_table.type_name}
                        </td>
                        <td className="py-4 px-6">
                          {booking.table.table_price}
                        </td>
                        <td className="py-4 px-6">{booking.user.firstname}</td>
                        <td className="py-4 px-6">
                          {booking.status_booking === "APPROVE" ? (
                            <span className="text-green-600 font-bold">
                              อนุมัติ
                            </span>
                          ) : booking.status_booking === "CANCEL" ? (
                            <span className="text-red-600 font-bold">
                              ยกเลิก
                            </span>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 flex space-x-2 justify-center">
                          <button
                            onClick={(e) =>
                              handleStatusChange(
                                e,
                                booking.booking_id,
                                booking.status_booking
                              )
                            }
                            className={`bg-red-600 hover:bg-red-700 text-white py-3 px-2 rounded-2xl dark:text-red-500 dark:hover:text-red-700 text-xs ${
                              booking.status_booking !== "APPROVE"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={booking.status_booking !== "APPROVE"}
                          >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            ยกเลิกการจอง
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
            {filteredBookings.length > perPage && (
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
                  {Math.ceil(filteredBookings.length / perPage)}
                </span>
                <button
                  className="bg-sky-500 text-white rounded-full px-4 py-2 hover:bg-sky-600 disabled:bg-sky-300 text-xs"
                  onClick={nextPage}
                  disabled={
                    currentPage === Math.ceil(filteredBookings.length / perPage)
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
