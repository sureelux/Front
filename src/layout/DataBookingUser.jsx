import axios from "axios";
import { useEffect, useState } from "react";
import userAuth from "../hooks/userAuth";

export default function BookingUser() {
  const { user } = userAuth();
  const [DataBookinguser, setBookingUser] = useState([]);

  useEffect(() => {
    const fetchBookingUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8889/admin/bookingUser",
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

  return (
    <div className="overflow-auto w-full h-screen p-10 bg-gradient-to-bl from-sky-300 to-white">
      <div className="mt-20 text-4xl font-bold text-center ">
        <span className="inline-block rounded-lg px-4 py-2 text-white [text-shadow:2px_1px_5px_var(--tw-shadow-color)] shadow-gray-800">
          ประวัติการจองโต๊ะ
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
        {DataBookinguser &&
          DataBookinguser.filter(
            (booking) => booking.userId === user.user_id
          ).map((booking, index) => (
            <div
              key={index}
              className="p-6 border-2 border-gray-500 rounded-lg shadow-xl bg-white mx-2 hover:scale-110 transition duration-300 ease-in-out"
            >
              <div className="p-2">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    รหัสการจอง:
                  </label>
                  <input
                    type="text"
                    value={booking.booking_id}
                    readOnly
                    className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    วันที่/เวลาจอง:
                  </label>
                  <input
                    type="text"
                    value={new Date(booking.booking_datatime).toLocaleString(
                      "th-TH"
                    )}
                    readOnly
                    className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ชื่อโต๊ะ:
                  </label>
                  <input
                    type="text"
                    value={booking.table.table_name}
                    readOnly
                    className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ประเภทโต๊ะ:
                  </label>
                  <input
                    type="text"
                    value={booking.table.type_table.type_name}
                    readOnly
                    className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    สถานะ:
                  </label>
                  <input
                    type="text"
                    value={
                      booking.status_booking === "APPROVE"
                        ? "อนุมัติ"
                        : booking.status_booking === "NOT_APPROVED"
                        ? "ไม่อนุมัติ"
                        : booking.status_booking === "WAIT"
                        ? "รออนุมัติ"
                        : ""
                    }
                    readOnly
                    className={`shadow appearance-none border rounded w-full py-2 text-sm px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      booking.status_booking === "APPROVE"
                        ? "text-green-500 font-medium text-xs"
                        : booking.status_booking === "NOT_APPROVED"
                        ? "text-red-500 font-medium text-xs"
                        : booking.status_booking === "WAIT"
                        ? "text-yellow-400 font-medium text-xs"
                        : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
