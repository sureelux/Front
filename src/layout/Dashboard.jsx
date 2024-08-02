import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUser,
  faTable,
  faClipboardList,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns"; 
import { format } from "date-fns-tz"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTableTypes, setTotalTableTypes] = useState(0);
  const [totalTables, setTotalTables] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersResponse = await axios.get(
          `http://localhost:8889/admin/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalUsers(usersResponse.data.users.length);

        // Fetch table types
        const typesResponse = await axios.get(
          `http://localhost:8889/admin/types`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalTableTypes(typesResponse.data.types.length);

        // Fetch tables
        const tablesResponse = await axios.get(
          "http://localhost:8889/user/tables",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalTables(tablesResponse.data.tables.length);

        // Fetch bookings
        const bookingsResponse = await axios.get(
          `http://localhost:8889/admin/bookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalBookings(bookingsResponse.data.bookings.length);
        setBookingData(bookingsResponse.data.bookings || []); // Ensure bookingData is an array
      } catch (error) {
        setError(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format the date in Thailand timezone
      const formattedTime = format(now, "yyyy-MM-dd HH:mm:ss", {
        timeZone: "Asia/Bangkok",
      });
      setCurrentTime(formattedTime);
    };

    updateTime();
    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  const processBookingData = () => {
    if (!Array.isArray(bookingData)) return { labels: [], data: [] };

    const approvedBookings = bookingData.filter(
      (booking) => booking.status === "approved"
    ); 

    const counts = approvedBookings.reduce((acc, booking) => {
      const date = booking.date;
      if (date) {
        const formattedDate = new Date(date).toISOString().split("T")[0]; // Format as YYYY-MM-DD
        if (!acc[formattedDate]) acc[formattedDate] = 0;
        acc[formattedDate]++;
      }
      return acc;
    }, {});

  
    const totalDays = Object.keys(counts).length;
    const totalBookingsCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const averageBookingsPerDay = totalDays > 0 ? totalBookingsCount / totalDays : 0;

    return {
      labels: Object.keys(counts),
      data: Object.keys(counts).map(date => averageBookingsPerDay),
    };
  };

  const { labels, data } = processBookingData();

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "ค่าเฉลี่ยการจองต่อวัน",
        data: data,
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "YYYY-MM-DD",
        },
        title: {
          display: true,
          text: "วันที่",
        },
      },
      y: {
        title: {
          display: true,
          text: "ค่าเฉลี่ยการจอง",
        },
      },
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center mt-20">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-info drawer-button lg:hidden text-white font-normal mt-5"
        >
          ดูข้อมูล
        </label>
        <div className="p-8 bg-gray-50 w-full">
          <h1 className="text-4xl font-bold text-gray-800 mb-10">แดชบอร์ด</h1>
          <div className="text-right mb-4 text-gray-600">
            <p className="text-xl text-black font-bold">
              <span className="block text-3xl mb-2">เวลาปัจจุบัน</span>
              <span className="block text-gray-600">{currentTime}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Link
              to="/DataUser"
              className="p-6 bg-white rounded-lg shadow-lg flex items-center space-x-4 cursor-pointer hover:bg-blue-50 transition"
            >
              <div className="p-6 bg-blue-100 rounded-lg shadow-lg flex items-center space-x-4 border border-gray-200">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-blue-500 text-4xl"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">
                    จำนวนผู้ใช้งานทั้งหมด
                  </h2>
                  <p className="text-4xl font-bold text-blue-600">
                    {totalUsers}
                  </p>
                </div>
              </div>
            </Link>
            <Link
              to="/DataType"
              className="p-6 bg-white rounded-lg shadow-lg flex items-center space-x-4 cursor-pointer hover:bg-green-50 transition"
            >
              <div className="p-6 bg-green-100 rounded-lg shadow-lg flex items-center space-x-4 border border-gray-200">
                <FontAwesomeIcon
                  icon={faTable}
                  className="text-green-500 text-4xl"
                />
                <div>
                  <h2 className="text-lg  font-semibold text-gray-700">
                    จำนวนประเภทโต๊ะทั้งหมด
                  </h2>
                  <p className="text-4xl font-bold text-green-600">
                    {totalTableTypes}
                  </p>
                </div>
              </div>
            </Link>
            <Link
              to="/DataTable"
              className="p-6 bg-white rounded-lg shadow-lg flex items-center space-x-4 cursor-pointer hover:bg-yellow-50 transition"
            >
              <div className="p-6 bg-yellow-100 rounded-lg shadow-lg flex items-center space-x-4 border border-gray-200">
                <FontAwesomeIcon
                  icon={faClipboardList}
                  className="text-yellow-500 text-4xl"
                />
                <div>
                  <h2 className="text-xl  font-semibold text-gray-700">
                    จำนวนโต๊ะทั้งหมด
                  </h2>
                  <p className="text-4xl font-bold text-yellow-600">
                    {totalTables}
                  </p>
                </div>
              </div>
            </Link>
            <Link
              to="/DataBooking"
              className="p-6 bg-white rounded-lg shadow-lg flex items-center space-x-4 cursor-pointer hover:bg-red-50 transition"
            >
              <div className="p-6 bg-red-100 rounded-lg shadow-lg flex items-center space-x-4 border border-gray-200">
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  className="text-red-500 text-4xl"
                />
                <div>
                  <h2 className="text-lg  font-semibold text-gray-700">
                    จำนวนการจองทั้งหมด
                  </h2>
                  <p className="text-4xl font-bold text-red-600">
                    {totalBookings}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              กราฟค่าเฉลี่ยการจองต่อวัน
            </h2>
            <Line data={chartData} options={chartOptions} />
          </div>
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
              <FontAwesomeIcon icon={faTable} className="mr-2" />{" "}
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
              <FontAwesomeIcon icon={faClipboardList} className="mr-2" />{" "}
              ข้อมูลโต๊ะ
            </Link>
          </li>
          <li>
              <Link
                to="/DataBooing_Approval"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/DataBooking")
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
              <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />{" "}
              ข้อมูลการจอง
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
