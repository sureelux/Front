import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const formattedDate = new Intl.DateTimeFormat("th-TH", options).format(date);

  const [day, month, year] = formattedDate.split("/");

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const thaiMonth = thaiMonths[parseInt(month, 10) - 1];
  return `${day} ${thaiMonth} ${year}`;
};

const thaiMonths = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const formatDateToBuddhistEra = (date) => {
  if (!date) return "";
  const day = format(date, "dd");
  const monthIndex = date.getMonth();
  const year = date.getFullYear() + 543;
  const month = thaiMonths[monthIndex];
  return `${day} ${month} ${year}`;
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
      <div className="flex absolute top-0 left-0 mt-20">
        <Link to="/Tables" className="text-black rounded-4xl p-2">
          <i className="fas fa-arrow-left" aria-label="Back"></i>
        </Link>
      </div>
      <form className="flex flex-col border-2 border-black rounded w-3/5 mx-auto p-10 pb-10 gap-7 mt-20 shadow-2xl bg-white h-[600px]">
        <div className="divider divider-info text-2xl mt-1 font-bold">
          เลือกเวลาจองโต๊ะ
        </div>
        <div className="">
          {bookingtable && (
            <div
              key={bookingtable.table_id}
              className="card-body text-center grid grid-cols-2 gap-4"
            >
              <div className="w-full flex justify-center">
                <figure className="w-full">
                  <img
                    src={bookingtable.table_img}
                    alt={bookingtable.table_name}
                  />
                </figure>
              </div>

              <div className="w-full pl-16 space-y-2">
                <div className="mb-4 text-left">
                  <label className="text-2xl font-bold">
                    ชื่อโต๊ะ :{" "}
                    <a className="font-normal">{bookingtable.table_name}</a>
                  </label>
                </div>
                <div className="mb-4 text-left">
                  <label className="text-xl font-bold">
                    ประเภท :{" "}
                    <a className="font-normal">
                      {bookingtable.type_table?.type_name}
                    </a>
                  </label>
                </div>
                <div className="mb-4 text-left">
                  <label className="product-price font-bold text-xl">
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
                      <span className="label-text-alt font-bold text-sm">
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
                      className="mt-1 ml-1 text-black hover:text-black bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-4 py-2.5 mb-1 cursor-pointer"
                      placeholderText="วัน/เดือน/ปี"
                      minDate={startOfToday()}
                      renderCustomHeader={({
                        date,
                        decreaseMonth,
                        increaseMonth,
                      }) => <div>{formatDateToBuddhistEra(date)}</div>}
                    />
                    <button
                      onClick={handleClearDate}
                      className="ml-4 text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-4 py-2 mb-1"
                    >
                      ล้างวันที่
                    </button>
                  </div>
                  <p className="mt-2 text-start font-bold text-sm">
                    วันที่เลือกจอง :{" "}
                    <span className="text-red-600 font-normal">
                      {startDate ? formatDate(startDate) : "ยังไม่ระบุ"}
                    </span>
                  </p>

                  <label className="form-control w-full max-w-[300px] mt-5">
                    <div className="label">
                      <span className="label-text-alt font-bold text-sm">
                        เลือกเวลาการจอง
                      </span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="time"
                        onChange={hdlChangeTime}
                        value={time}
                        className="ml-1 mt-1 text-black bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-6 py-2 mb-1 cursor-pointer"
                      />
                      <button
                        onClick={handleClearTime}
                        type="button"
                        className="ml-4 text-white text-xs bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-4 py-2.5 mb-1"
                      >
                        ล้างเวลา
                      </button>
                    </div>
                    <p className="mt-2 text-start font-bold text-sm">
                      เวลาที่เลือกจอง :
                      <span className="text-red-600 font-normal text-sm">
                        {time ? time : " ยังไม่ระบุ "}
                      </span>
                    </p>
                  </label>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end ml-auto">
            <button
              type="button"
              className="text-white bg-gradient-to-l bg-green-500 from-green-400  font-medium rounded-full text-xs px-16 py-3 text-center ml-auto me-4"
              onClick={hdlSubmit}
            >
              <FontAwesomeIcon icon={faBook} className="mr-2" />
              จอง
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
