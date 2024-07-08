import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../hooks/userAuth";
import Tables from "./Tables";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';


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
    if (!input.booking_datatime) {
      alert("กรุณาเลือกเวลาจองโต๊ะอาหาร");
      return;
    }
  
    try {
      const rs = await axios.post("http://localhost:8889/admin/bookings", input);
      if (rs.status === 200) {
        const id = rs.data.booking.booking_id;
        navigate("/Succeed");
      } else {
        alert("ไม่สามารถจองได้ ... ");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการจอง");
    }
  };
  

  return (
    <div
    className="min-h-screen flex flex-col items-center justify-center p-1 bg-sky-200"
  >
      <form className="flex flex-col border-2 border-black rounded w-4/6 mx-auto p-10 gap-7 mt-20 shadow-2xl bg-white">
        <div className="divider divider-info text-3xl mt-8 font-bold">
          เลือกเวลาจองโต๊ะ
        </div>
        <div className="grid grid-cols-2 gap-4">
          {bookingtable && (
            <div
              key={bookingtable.table_id}
              className="card-body items-center text-center"
            >
              <figure className="w-3/5">
                <img
                  src={bookingtable.table_img}
                  alt={bookingtable.table_name}
                />
              </figure>
              <div className="flex flex-col gap-3 mt-5">
                <h3 className="text-2xl font-bold">
                  ชื่อโต๊ะ : {bookingtable.table_name}
                </h3>
                <h3 className="product-price font-bold text-2xl">
                  ราคา{" "}
                  <label className="text-red-600 text-2xl font-normal">
                    {bookingtable.table_price}
                  </label>{" "}
                  บาท
                </h3>
              </div>
            </div>
          )}
          <div className="flex justify-center items-center">
            <label className="form-control w-full max-w-[300px]">
              <div className="label t">
                <span className="label-text-alt text-base font-bold">
                  เลือกวันที่/เวลาการจอง
                </span>
              </div>
              <input
                className="text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-1 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                type="datetime-local"
                name="booking_datatime"
                value={input.booking_datatime}
                onChange={hdlChange}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end ">
          <p
            className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-3xl text-sm px-20 py-4 text-center me-2 mb-1"
            onClick={hdlSubmit}
          ><FontAwesomeIcon icon={faBook} className="mr-2" />
            จอง
          </p>
        </div>
      </form>
    </div>
  );
}
