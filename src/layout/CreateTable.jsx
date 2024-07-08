import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faChair,
  faDollarSign,
  faTag,
  faSave
} from "@fortawesome/free-solid-svg-icons";

export default function CreateTable() {
  const navigate = useNavigate(); 
  const [typeTable, setTypeTable] = useState([]);
  const [tables, setTables] = useState({
    table_img: "",
    table_name: "",
    table_status: "FREE",
    table_price: "",
    type_name: "1",
  });

  useEffect(() => {
    const fetchTypes = async () => {
      const rs = await axios.get("http://localhost:8889/admin/types");
      setTypeTable(rs.data.types);
    };
    fetchTypes();
  }, []);

  const hdlChange = (e) => {
    setTables((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    try {
      const rs = await axios.post("http://localhost:8889/admin/tables", tables);
      alert("คุณได้เพิ่มข้อมูลโต๊ะเรียบร้อยแล้ว");
      console.log(rs);
      navigate("/DataTable"); // Redirect to /DataTable
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-bl from-sky-400 to-white">
      <div className="flex absolute top-0 left-0 mt-20">
        <Link to="/DataTable" className=" text-black rounded-4xl p-2">
          <i className="fas fa-arrow-left"></i>
        </Link>
      </div>
      <form
        className="flex flex-col min-w-[550px] border border-gray-500 w-1/2  mx-auto p-12 gap-4 mt-16 rounded-xl shadow-2xl bg-white"
        onSubmit={hdlSubmit}
      >
        <div className="text-4xl font-bold [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-gray-500">
          เพิ่มข้อมูลโต๊ะ
        </div>
        <div className="mt-5">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">
                <FontAwesomeIcon icon={faImage} className="mr-2" />
                รูป (ลิงค์)
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full pl-5"
              name="table_img"
              value={tables.table_img}
              onChange={hdlChange}
            />
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text font-bold">
                <FontAwesomeIcon icon={faChair} className="mr-2" />
                ชื่อโต๊ะ
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full pl-5"
              name="table_name"
              value={tables.table_name}
              onChange={hdlChange}
            />
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text font-bold">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                ราคา
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full pl-5"
              name="table_price"
              value={tables.table_price}
              onChange={hdlChange}
              pattern="\d*"
              title="กรุณาใส่ตัวเลขเท่านั้น"
            />
          </label>
          <label className="form-control w-full max-w-full">
            <div className="label">
              <span className="label-text font-bold">
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                ประเภท
              </span>
            </div>
            <select
              className="select select-bordered"
              onChange={hdlChange}
              name="type_name"
              value={tables.type_name}
            >
              {typeTable.map((el) => (
                <option key={el.type_id} value={el.type_id}>
                  {el.type_name}
                </option>
              ))}
            </select>
          </label>

          <div className="justify-center mt-10">
            <button className="bg-green-500 text-white w-36 h-12 font-normal rounded-3xl drop-shadow-xl">
            <FontAwesomeIcon icon={faSave} className="mr-2"/>บันทึก
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
