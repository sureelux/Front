import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAuth from "../hooks/userAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { startOfToday } from "date-fns";
import Swal from "sweetalert2";

const formatDate = (date) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Intl.DateTimeFormat("th-TH", options).format(date);
};

export default function BookingTable() {
  const navigate = useNavigate();
  const { user } = userAuth();
  const tableId = location.pathname.split("/")[2];

  const [bookingtable, setBookingTable] = useState({});
  const [input, setInput] = useState({
    booking_datatime: "",
    status_booking: "",
    user_id: +user.user_id,
    table_id: tableId,
  });
  const [startDate, setStartDate] = useState(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const getBookingTable = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8889/user/tables/${tableId}`,
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

  const hdlChangeTime = (event) => {
    const newTime = event.target.value;
    setTime(newTime);
  };

  const handleClearDate = (e) => {
    e.preventDefault();
    setStartDate(null);
  };

  const handleClearTime = (e) => {
    e.preventDefault();
    setTime("");
  };

  const hdlSubmit = async () => {
    if (!startDate || !time) {
      Swal.fire("กรุณาเลือกวันที่และเวลาจองโต๊ะอาหาร");
      return;
    }

    const bookingDateTime = `${format(startDate, "yyyy-MM-dd")} ${time}`;

    try {
      const token = localStorage.getItem("token");
      const rs = await axios.post(
        "http://localhost:8889/user/bookings",
        { ...input, booking_datatime: bookingDateTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (rs.status === 200) {
        navigate("/Succeed");
      } else {
        Swal.fire("ไม่สามารถจองได้ ... ");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("เกิดข้อผิดพลาดในการจอง");
    }
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
                    ชื่อโต๊ะ :{" "}
                    <a className="font-normal">{bookingtable.table_name}</a>
                  </label>
                </div>
                <div className="mb-4 text-left">
                  <label className="text-2xl font-bold">
                    ประเภท :{" "}
                    <a className="font-normal">
                      {bookingtable.type_table?.type_name}
                    </a>
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
                        เลือกวันที่การจอง
                      </span>
                    </div>
                  </label>
                  <div className="flex items-center">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      locale={th}
                      className="mt-1 ml-1 text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-8 py-2.5 mb-1"
                      placeholderText="วัน/เดือน/ปี"
                      minDate={startOfToday()}
                    />
                    <button
                      onClick={handleClearDate}
                      className="ml-4 text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 mb-1"
                    >
                      ล้างวันที่
                    </button>
                  </div>
                  <p className="mt-4 text-start">
                    วันที่เลือกจอง : {formatDate(startDate)}
                  </p>
                  <label className="form-control w-full max-w-[300px] mt-5">
                    <div className="label">
                      <span className="label-text-alt font-bold text-xl">
                        เลือกเวลาการจอง
                      </span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="time"
                        onChange={hdlChangeTime}
                        value={time}
                        required
                        className="ml-1 mt-1 text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-6 py-2 mb-1"
                      />
                      <button
                        onClick={handleClearTime}
                        type="button"
                        className="ml-4 text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 mb-1"
                      >
                        ล้างเวลา
                      </button>
                    </div>
                    <p className="mt-5 text-start">เวลาที่เลือกจอง : {time}</p>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end ">
          <button
            type="button"
            className="text-white bg-gradient-to-l bg-green-500 from-green-400 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-3xl text-sm px-20 py-4 text-center me-2 mb-1"
            onClick={hdlSubmit}
          >
            <FontAwesomeIcon icon={faBook} className="mr-2" />
            จอง
          </button>
        </div>
      </form>
    </div>
  );
}
