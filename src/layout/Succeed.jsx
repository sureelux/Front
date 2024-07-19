import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../hooks/userAuth";

export default function Succeed() {
  const navigate = useNavigate();

  const hdlHome = () => {
    navigate("/Tables");
  };
  return (
    <div className="h-screen flex items-center justify-center mt-5">
      <form className="flex flex-col items-center min-w-[600px] border-gray-300 bg-gray-100 rounded-3xl w-11/12 p-5 gap-7">
        <div className="hero-content flex flex-col items-center lg:flex-row">
          <img
            src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_1280.png"
            alt="Success"
            className="max-w-sm rounded-lg w-60 h-60 mb-6 lg:mb-0"
          />
        </div>
        <div className="text-center text-5xl font-bold text-green-500 [text-shadow:1px_1px_1px_var(--tw-shadow-color)] shadow-gray-900">จองโต๊ะสำเร็จ</div>
        <p className="text-center text-xl">คุณได้จองโต๊ะอาหารเรียบร้อยแล้ว</p>
        <div className="flex justify-center">
          <button
            onClick={hdlHome}
            className="text-white bg-gradient-to-r from-green-500 to-green-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 md:px-6 md:py-4 text-center mb-2"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </form>
    </div>
  );
}
