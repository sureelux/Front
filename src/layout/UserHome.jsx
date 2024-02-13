import axios from "axios";
import { useEffect, useState } from "react";

export default function UserHome() {
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
    <div className="hero min-h-screen" style={{backgroundImage: 'url(https://nocnoc.com/blog/wp-content/uploads/2021/03/01-dining-table-decorate.jpg)'}}>
    <div className="hero-overlay bg-opacity-60"></div>
    <div className="hero-content text-center text-neutral-content">
      <div className="max-w-md">
        <h1 className="mb-5 text-5xl font-bold">ยินดีต้อนรับ</h1>
        <p className="mb-5">ระบบการจองโต๊ะอาหารออนไลน์ เพื่อจองที่นั่งล่วงหน้าไม่ต้องไปรอลุ้นหน้าร้านว่าจะมีโต๊ะไหม </p>
      </div>
    </div>
  </div>

  );
  
}
