import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../hooks/userAuth";

export default function Succeed() {

  const navigate = useNavigate();

  const hdlHome = () => {
    navigate('/Tables')
  }
  return (
    <div className="h-screen">
      <form
        className="flex flex-col min-w-[600px] border-2 border-gray-300  bg- rounded w-5/6 mx-auto p-10 gap-7 mt-28"
      >
        <div className="hero-content flex-col lg:flex-row">
      <img src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_1280.png" className="max-w-sm rounded-lg w-60 h-60"/>
      </div>
        <div className="text-center text-5xl font-bold">
        จองโต๊ะสำเร็จ
        </div>
        <p className="text-center">คุณได้จองโต๊ะอาหารเรียบร้อยแล้ว</p>
        <div class="flex justify-center ml-96">
        <button onClick={hdlHome} className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 md:px-6 md:py-4 text-center me-96 mb-2">กลับหน้าหลัก</button>
        </div>
      </form>
    </div>
  );
}
