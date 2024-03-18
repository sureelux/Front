import axios from "axios";
import { useEffect, useState } from "react";
import userAuth from "../hooks/userAuth";

export default function BookingUser() {
  const { user } = userAuth();
  const [DataBookinguser, setBookingUser] = useState([]);

  function formatDate(dateString) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options);
  }

  useEffect(() => {
    const BookingUsers= async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8889/admin/bookingUser", {
          headers: { Authorization: ` Bearer ${token}` },
        });
        setBookingUser(response.data.BookingUser);
        console.log(response.data.BookingUser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    BookingUsers();
  }, [setBookingUser]);

  return (
    <div className="overflow-autos w-full h-screen">
      <div className="mt-24 ml-2 text-3xl font-bold text-center">ข้อมูลการจอง</div>
      <div className="overflow-x-auto">
        <table className="table table-zebra mt-4">
          {/* head */}
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-white">
              <th>วันที่/เวลาจอง</th>
              <th>ชื่อโต๊ะ</th>
              <th>ประเภทโต๊ะ</th>
              <th>ชื่อลูกค้า</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody className="font-medium text-black">
            {DataBookinguser && DataBookinguser.filter(el => el.userId=== user.user_id).map( (el, number ) => (
              <tr key={number +1}>
                <td>
                      {new Date(el.booking_datatime).toLocaleString(
                        "th-TH"
                      )}
                    </td>
                    <td>{el.table.table_name}</td>
                    <td>{el.table.type_table.type_name}</td>
                    <td>{el.user.firstname}</td>
                    <td className={el.status_booking === 'APPROVE' ? 'text-green-500' : el.status_booking === 'NOT_APPROVED' ? 'text-red-500 font-medium' : el.status_booking === 'WAIT' ? 'text-yellow-400 font-medium' : ''}>
                      {el.status_booking === "APPROVE"
                        ? "อนุมัติ"
                        : el.status_booking === "NOT_APPROVED"
                        ? "ไม่อนุมัติ"
                        : el.status_booking === "WAIT"
                        ? "รออนุมัติ"
                        : ""}
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

}