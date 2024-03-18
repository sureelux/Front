import axios from "axios";
import React, { useState } from "react";

export default function CreateType() {
  const [types, setTypes] = useState({
    type: "",
  });

  const hdlChange = (e) => {
    setTypes((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      // setInput(prv => ({...prv, dueDate : new Date(prv.dueDate)}))
      // const token = localStorage.getItem("token");
      const rs = await axios.post("http://localhost:8889/admin/types", types);
      alert("เพิ่มข้อมูลเรียบร้อยแล้ว");
      console.log(rs);
      location.reload();
    } catch (err) {
      alert(err.message);
    }
    // console.log(output)
  };

  return ( 
    <div className="h-screen text-center mt-10">
      <p className="font-bold text-4xl">เพิ่มข้อมูลประเภท</p>
  <div className="hero-content flex-col lg:flex-row mt-10">
    <img src="https://cx.lnwfile.com/_/cx/_raw/hp/qz/vu.jpg" className="max-w-sm rounded-lg shadow-2xl w-96" />
    <div>
    <form
        className="flex flex-col min-w-[600px] border min-h-64 p-14 gap-6 mt-5 rounded-xl ml-20"
        onSubmit={hdlSubmit}
      >
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text font-bold">ชื่อประเภท</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full"
            name="type"
            value={types.type}
            onChange={hdlChange}
          />
        </label>
        <button className="btn btn-secondary mt-5 w-32 h-12 font-normal rounded-2xl shadow-2xl">
          เพิ่มข้อมูล
        </button>
      </form>
    </div>
  </div>
</div>
   
  );
}

