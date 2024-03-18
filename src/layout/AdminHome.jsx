import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminHome() {
  const [todos, setTodos] = useState([]);
  function FormatDate(dateString) {
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
    const run = async () => {
      let token = localStorage.getItem("token");
      const rs = await axios.get("http://localhost:8889/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(rs.data.todos);
    };
    run();
  }, []);

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://blog.hungryhub.com/wp-content/uploads/2022/07/S__1343516_2_11zon.jpg)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">ยินดีต้อนรับ</h1>
          <h1 className="mb-5 text-4xl font-bold">ผู้ดูแลระบบ</h1>
          <p className="mb-5">ระบบสามารถเพิ่ม แก้ไข ข้อมูลโต๊ะอาหารได้</p>
          <Link
            to="/Data"
            className="btn btn-neutral-content form-control mt-0 font-medium shadow-xl"
          >
            ดูข้อมูล
          </Link>
        </div>
      </div>
    </div>
  );
}
