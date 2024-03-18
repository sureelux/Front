import axios from "axios";
import React, { useEffect, useState } from "react";

export default function CreateTable() {
  const [ typeTable, setTypeTable ] = useState([])
  const [tables, setTables] = useState({
    table_img: "",
    table_name : "",
    table_status : "FREE",
    table_price : "",
    type_name : "1",
  });

  useEffect( () => {
    const type = async () => {
      const rs = await axios.get('http://localhost:8889/admin/types')
      setTypeTable(rs.data.types)
    }
    type();
    // console.log(typeTable)
  }, []);

  const hdlChange = (e) => {
    setTables((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      // setInput(prv => ({...prv, dueDate : new Date(prv.dueDate)}))
      // const token = localStorage.getItem("token");
      const rs = await axios.post("http://localhost:8889/admin/tables", tables);
      alert("เพิ่มข้อมูลเรียบร้อยแล้ว");
      console.log(rs);
      location.reload();
    } catch (err) {
      alert(err.message);
    }
    // console.log(output)
  };


  return (
    <div>
    <div className="text-4xl mt-8 font-bold text-center">เพิ่มข้อมูลโต๊ะ</div>
  <form
    className="flex flex-col min-w-[600px] border w-1/2  mx-auto p-16 gap-4 mt-8 rounded-xl "
    onSubmit={hdlSubmit}
  >
    <label className="form-control w-full ">
      <div className="label">
        <span className="label-text font-bold">รูป (ลิงค์)</span>
      </div>
      <input
        type="text"
        className="input input-bordered w-full"
        name="table_img"
        value={tables.title}
        onChange={hdlChange}
      />
    </label>
    <label className="form-control w-full ">
      <div className="label">
        <span className="label-text font-bold">ชื่อโต๊ะ</span>
      </div>
      <input
        type="text"
        className="input input-bordered w-full"
        name="table_name"
        value={tables.table_name}
        onChange={hdlChange}
      />
    </label>

    <label className="form-control w-full ">
      <div className="label">
        <span className="label-text font-bold">ราคา</span>
      </div>
      <input
        type="text"
        className="input input-bordered w-full"
        name="table_price"
        value={tables.table_price}
        onChange={hdlChange}
      />
    </label>
    <label className="form-control w-full max-w-full">
      <div className="label">
        <span className="label-text font-bold">ประเภท</span>
      </div>
      <select className="select select-bordered" onChange={hdlChange} name="type_name">
      {typeTable.map( el => (
        <option key={el.type_id} value={el.type_id}>{el.type_name}</option>
      ))}
      </select>
    </label>
    <button className="btn btn-secondary mt-2 w-32 h-12 font-normal rounded-2xl shadow-2xl">เพิ่มข้อมูล</button>
  </form>
  </div>
  );
}
