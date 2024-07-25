import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import userAuth from "../hooks/userAuth";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function BookingUser() {
  const { user } = userAuth();
  const [DataBookinguser, setBookingUser] = useState([]);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const fetchBookingUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8889/user/bookingUser`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookingUser(response.data.BookingUser);
        console.log(response.data.BookingUser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBookingUsers();
  }, []);

  const showBookingDetails = (booking) => {
    MySwal.fire({
      title: "รายละเอียดการจอง",
      html: (
        <div className="bg-white p-6 rounded-lg shadow-lg text-left space-y-4 border border-gray-200">
          <p className="text-lg font-semibold text-gray-800">
            <span className="font-bold">รหัสการจอง : </span>{" "}
            <span className="font-normal">{booking.booking_id}</span>
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-bold">วันที่/เวลาจอง : </span>{" "}
            <span className="font-normal">
              {new Date(booking.booking_datatime).toLocaleString("th-TH")}
            </span>
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-bold">ชื่อโต๊ะ : </span>{" "}
            <span className="font-normal">{booking.table.table_name}</span>
          </p>
          <p className="text-lg font-semibold text-gray-800">
            <span className="font-bold text-gray-800">ประเภทโต๊ะ : </span>{" "}
            <span className="font-normal">
              {booking.table.type_table.type_name}
            </span>
          </p>
          <p className="text-lg">
            <span className="font-bold text-gray-800">สถานะ : </span>{" "}
            <span
              className={`${
                booking.status_booking === "APPROVE"
                  ? "text-green-600"
                  : booking.status_booking === "NOT_APPROVED"
                  ? "text-red-600"
                  : booking.status_booking === "WAIT"
                  ? "text-yellow-600"
                  : "text-gray-600"
              } font-medium`}
            >
              {booking.status_booking === "APPROVE"
                ? "อนุมัติ"
                : booking.status_booking === "NOT_APPROVED"
                ? "ไม่อนุมัติ"
                : booking.status_booking === "WAIT"
                ? "รออนุมัติ"
                : "ไม่ทราบสถานะ"}
            </span>
          </p>
        </div>
      ),
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: "ปิด",
    });
  };

  return (
    <div className="overflow-auto w-full h-screen p-10 bg-gradient-to-bl from-sky-300 to-white">
      <div className="mt-20 text-5xl font-bold text-center ">
        <span className="inline-block rounded-lg px-4 py-2 text-white [text-shadow:2px_1px_5px_var(--tw-shadow-color)] shadow-gray-900">
          ประวัติการจองโต๊ะ
        </span>
      </div>
      <div className="container mx-auto py-5">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-lg font-semibold text-white uppercase tracking-wider text-center">
                  วันที่/เวลาจอง
                </th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-lg font-semibold text-white uppercase tracking-wider text-center">
                  ชื่อโต๊ะ
                </th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-lg font-semibold text-white uppercase tracking-wider text-center">
                  ประเภทโต๊ะ
                </th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-lg font-semibold text-white uppercase tracking-wider text-center">
                  สถานะ
                </th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-lg font-semibold text-white uppercase tracking-wider text-center">
                  ดูรายละเอียด
                </th>
              </tr>
            </thead>
            <tbody>
              {DataBookinguser &&
                DataBookinguser.filter(
                  (booking) => booking.userId === user.user_id
                ).map((booking, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition duration-300 ease-in-out"
                  >
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                      {new Date(booking.booking_datatime).toLocaleString(
                        "th-TH"
                      )}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                      {booking.table.table_name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                      {booking.table.type_table.type_name}
                    </td>
                    <td
                      className={`px-6 py-4 border-b border-gray-200 text-sm font-medium text-center ${
                        booking.status_booking === "APPROVE"
                          ? "text-green-500"
                          : booking.status_booking === "NOT_APPROVED"
                          ? "text-red-500"
                          : booking.status_booking === "WAIT"
                          ? "text-yellow-400"
                          : ""
                      }`}
                    >
                      {booking.status_booking === "APPROVE"
                        ? "อนุมัติ"
                        : booking.status_booking === "NOT_APPROVED"
                        ? "ไม่อนุมัติ"
                        : booking.status_booking === "WAIT"
                        ? "รออนุมัติ"
                        : ""}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                      <button
                        onClick={() => showBookingDetails(booking)}
                        className="flex justify-center items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mx-auto"
                      >
                        <i className="fas fa-info-circle mr-2"></i>
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
