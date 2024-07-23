import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faSave } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function CreateType() {
  const navigate = useNavigate();
  const [types, setTypes] = useState({ type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setTypes((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!types.type) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกชื่อประเภท',
        text: 'ชื่อประเภทไม่สามารถเป็นค่าว่างได้',
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const checkRes = await axios.get(`http://localhost:8889/admin/types/check?type=${types.type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (checkRes.data.exists) {
        Swal.fire({
          icon: 'error',
          title: 'ชื่อประเภทมีอยู่แล้ว',
          text: 'กรุณาเลือกชื่อประเภทอื่น',
        });
        setLoading(false);
        return;
      }

      await axios.post("http://localhost:8889/admin/types", types, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'คุณได้เพิ่มข้อมูลประเภทโต๊ะเรียบร้อยแล้ว',
      });
      navigate("/DataType");
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-white to-sky-400">
      <div className="flex absolute top-0 left-0 mt-20">
        <Link to="/DataType" className="text-black rounded-4xl p-2">
          <i className="fas fa-arrow-left" aria-label="Back"></i>
        </Link>
      </div>
      <form
        className="flex flex-col min-w-[600px] min-h-64 p-14 gap-6 mt-10 rounded-xl shadow-2xl w-10 bg-white border border-gray-500"
        onSubmit={handleSubmit}
      >
        <div className="text-4xl font-bold [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-gray-500">
          เพิ่มข้อมูลประเภทโต๊ะ
        </div>
        <div className="mt-5">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                ชื่อประเภท
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                className="input input-bordered w-full pl-5"
                name="type"
                value={types.type}
                onChange={handleChange}
                aria-label="Type name"
              />
            </div>
          </label>
          <div className="flex justify-end items-end mt-10">
            <button
              type="submit"
              className={`bg-green-500 text-white w-36 h-12 font-normal rounded-3xl drop-shadow-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {loading ? 'บันทึก...' : 'บันทึก'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
