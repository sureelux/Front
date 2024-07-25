import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminHome() {
  
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://canteen.techximizer.co.th/img/1507802775909.JPG)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-6xl font-bold [text-shadow:2px_1px_3px_var(--tw-shadow-color)] shadow-gray-400 animate-bounce">ยินดีต้อนรับ</h1>
          <h1 className="mb-5 text-4xl font-bold animate-bounce">ผู้ดูแลระบบ</h1>
          <p className="mb-5">ผู้ดูแลระบบสามารถจัดการข้อมูลได้
          </p>
          <Link
            to="/Dashboard"
            className="btn btn-neutral-content form-control mt-0 font-medium shadow-xl"
          >
            ดูข้อมูล
          </Link>
        </div>
      </div>
    </div>
  );
}
