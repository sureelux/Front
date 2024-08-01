import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAuth from "../hooks/userAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';

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
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8889/user/tables/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookingTable(response.data.tables);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };
    getBookingTable();
  }, [tableId]);

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async () => {
    if (!input.booking_datatime) {
      alert("กรุณาเลือกเวลาจองโต๊ะอาหาร");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const rs = await axios.post(
        "http://localhost:8889/user/bookings",
        input, 
        {
          headers: { Authorization: `Bearer ${token}` },
        } 
      );
      if (rs.status === 200) {
        navigate("/Succeed");
      } else {
        alert("ไม่สามารถจองได้ ... ");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการจอง");
    }
  };

  // Convert datetime to dd/MM/yyyy format
  const formatDate = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY HH:mm');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-1 bg-sky-200">
      <form className="flex flex-col border-2 border-black rounded w-4/6 mx-auto p-10 gap-7 mt-20 shadow-2xl bg-white">
        <div className="divider divider-info text-4xl mt-5 font-bold">
          เลือกเวลาจองโต๊ะ
        </div>
        <div className="gap-8">
          {bookingtable && (
            <div
              key={bookingtable.table_id}
              className="card-body text-center grid grid-cols-2 gap-14 gap-y-14 items-start"
            >
              <div className="w-full flex justify-center shadow-xl">
                <figure className="w-full">
                  <img
                    src={bookingtable.table_img}
                    alt={bookingtable.table_name}
                  />
                </figure>
              </div>

              <div className="w-full pl-5 space-y-9">
                <div className="mb-4 text-left">
                  <label className="text-5xl font-bold">
                    ชื่อโต๊ะ : <a className="font-normal">{bookingtable.table_name}</a>
                  </label>
                </div>
                <div className="mb-4 text-left">
                  <label className="text-2xl font-bold">
                    ประเภท : <a className="font-normal">{bookingtable.type_table?.type_name}</a>
                  </label>
                </div>
                <div className="mb-4 text-left">
                  <label className="product-price font-bold text-2xl">
                    ราคา{" "}
                    <a className="text-red-600 text-2xl font-normal">
                      {bookingtable.table_price}
                    </a>{" "}
                    บาท
                  </label>
                </div>
                <div className="mt-5">
                  <label className="form-control w-full max-w-[300px]">
                    <div className="label">
                      <span className="label-text-alt font-bold text-xl">
                        เลือกวันที่/เวลาการจอง
                      </span>
                    </div>
                    <input
                      className="text-black hover:text-white bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                      type="datetime-local"
                      name="booking_datatime"
                      value={input.booking_datatime}
                      onChange={hdlChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end ">
          <p
            className="text-white bg-gradient-to-l bg-green-500 from-green-00 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-3xl text-sm px-20 py-4 text-center me-2 mb-1"
            onClick={hdlSubmit}
          >
            <FontAwesomeIcon icon={faBook} className="mr-2" />
            จอง
          </p>
        </div>
      </form>
    </div>
  );
}
