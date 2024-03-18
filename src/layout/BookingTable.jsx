import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../hooks/userAuth";
import Tables from "./Tables";

export default function BookingTable() {
  const navigate = useNavigate();
  const { user } = userAuth();
  const tableId = location.pathname.split("/")[2];

  const [bookingtable, setBookingTable] = useState([]);
  const [input, setInput] = useState({
    booking_datatime: "",
    status_booking: "",
    user_id: +user.user_id,
    table_id: tableId,
  });

  useEffect(() => {
    const getBookingTable = async () => {
      try {
        const id = tableId;
        const response = await axios.get(
          `http://localhost:8889/admin/tables/${id}`
        );
        setBookingTable(response.data.tables);
        // console.log(response.data)

      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };
    getBookingTable();
  }, []);

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async () => {
    const rs = await axios.post("http://localhost:8889/admin/bookings", input);
    if (rs.status === 200) {
      const id = rs.data.booking.booking_id;
      navigate('/Succeed');
    } else {
      alert("ไม่สามารถจองได้ ... ");
    }
  };

  
  return (
    <div className=" min-h-screen mt-28">
      <form className="flex flex-col border rounded w-5/6 mx-auto p-10 gap-7 mt-16">
        <div className="divider divider-info text-2xl mt-5 font-bold">
          กรุณาใส่ข้อมูลการจองโต๊ะ
        </div>

        {bookingtable && (
          <div
            key={bookingtable.table_id}
            className="card-body items-center text-center"
          >
            <figure className="size-1/4">
              <img src={bookingtable.table_img}  />
            </figure>
            <div className="flex flex-col gap-3 mt-5">
              <h3 className="text-xl font-bold ">
                ชื่อโต๊ะ : {bookingtable.table_name}
              </h3>
              <h3 className="product-price font-bold">
                ราคา :{" "}
                <label class="text-red-600 text-xl">
                  {bookingtable.table_price}
                </label>{" "}
                บาท
              </h3>
              <div className="card-actions mx-auto px-5 text-center w-full"></div>
            </div>
          </div>
        )}
        <div className="flex justify-center items-center">
          <label className="form-control w-full max-w-[260px]">
            <div className="label t">
              <span className="label-text-alt text-base font-bold">
                เลือกวันที่/เวลาการจอง
              </span>
            </div>
            <input
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              type="datetime-local"
              name="booking_datatime"
              value={input.booking_datatime}
              onChange={hdlChange}
            />
          </label>
        </div>

        <div className="flex justify-center items-center">
  <p className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-16 py-2.5 text-center me-2 mb-2" onClick={hdlSubmit}>
    จอง
  </p>
</div>
      </form>
    </div>
  );
}
