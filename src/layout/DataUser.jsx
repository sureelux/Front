import axios from "axios";
import { useEffect, useState } from "react";

export default function DataUser() {
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
    <div className="overflow-x-auto">
        <p className="">ข้อมูลผู้ใช้งาน</p>
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th></th>
          <th>userId</th>
          <th>username</th>
          <th>password</th>
          <th>firsname</th>
          <th>lastname</th>
          <th>address</th>
          <th>phone</th>
          <th>email</th>
          <th></th>
        </tr>
      </thead>
    </table>
  </div>
  );
}
