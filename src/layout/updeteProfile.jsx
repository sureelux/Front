import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";

import { useEffect, useState } from "react";
import axios from "axios";

const guestNav = [{ to: "/" }];

const userNav = [{ to: "/", text: "Home" }];

export default function updateProfile() {
  const { user, logout } = useAuth();
  const finalNav = user?.user_id ? userNav : guestNav;
  const navigate = useNavigate();

  const [input, setInput] = useState({
    username: "",
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    email: "",
  });
  useEffect(() => {
    setInput({
      username: user?.username,
      firstname: user?.firstname,
      lastname: user?.lastname,
      address: user?.address,
      phone: user?.phone,
      email: user?.email,
    });
  }, [user?.user_id]);

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      const output = { ...input };
      const token = localStorage.getItem("token");
      const rs = await axios.put(
        `http://localhost:8889/user/${user.user_id}`,
        output,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("คุณได้แก้ไขข้อมูลบัญชีเรียบร้อยแล้ว");
      navigate("/Profile")
      location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="text-center min-h-screen pb-16">
      <div className="flex absolute top-0 left-0 mt-20">
        <Link to="/Profile" className="text-black rounded-4xl p-2">
          <i className="fas fa-arrow-left"></i>
        </Link>
      </div>
      <p className="text-3xl pt-24 font-bold">
        แก้ไขบัญชีของ{" "}
        <label className="text-3xl pt-24 text-red-600">
          {user?.user_id ? user.username : "Guest"}
        </label>
      </p>
      <form className="flex flex-col min-w-[600px] border-2 w-4/5 border-black mx-auto p-14 gap-1 mt-1 rounded-xl bg-sky-200 shadow-xl">
        <div className="flex items-center justify-center h-40 w-40 bg-gray-300 rounded-full overflow-hidden shadow-2xl">
          <img
            className="w-full object-cover"
            src="https://cdn-icons-png.freepik.com/512/13481/13481872.png"
            alt="โปรไฟล์ของคุณ"
          />
        </div>
        <div className="flex flex-wrap col-3 justify-between">
          <div className="w-full sm:w-1/3 p-1">
            <label className="form-control w-full max-w rounded-full">
              <div className="label">
                <span className="label font-bold">ชื่อผู้ใช้</span>
              </div>
              <input
                className="input input-bordered w-4/5 max-w-lg rounded-2xl border-gray-400"
                type="text"
                name="username"
                value={input.username}
                onChange={hdlChange}
              />
            </label>
          </div>
          <div className="w-full sm:w-1/3 p-1">
            <label className="form-control w-full max-w rounded-full">
              <div className="label">
                <span className="label font-bold">ชื่อ</span>
              </div>
              <input
                className="input input-bordered w-5/6 max-w-lg rounded-2xl border-gray-400"
                type="text"
                name="firstname"
                value={input.firstname}
                onChange={hdlChange}
              />
            </label>
          </div>
          <div className="w-full sm:w-1/3 p-1">
            <label className="form-control w-full max-w rounded-full">
              <div className="label">
                <span className="label font-bold">นามสกุล</span>
              </div>
              <input
                className="input input-bordered w-4/5 max-w-lg rounded-2xl border-gray-400"
                type="text"
                name="lastname"
                value={input.lastname}
                onChange={hdlChange}
              />
            </label>
          </div>
          <div className="w-full sm:w-1/3 p-1">
            <label className="form-control w-full max-w rounded-full">
              <div className="label">
                <span className="label font-bold">ที่อยู่</span>
              </div>
              <input
                className="input input-bordered w-4/5 max-w-lg rounded-2xl border-gray-400"
                type="text"
                name="address"
                value={input.address}
                onChange={hdlChange}
              />
            </label>
          </div>
          <div className="w-full sm:w-1/3 p-1">
            <label className="form-control w-full max-w rounded-full">
              <div className="label">
                <span className="label font-bold">เบอร์โทรศัพท์</span>
              </div>
              <input
                className="input input-bordered w-4/5 max-w-lg rounded-2xl border-gray-400"
                type="text"
                name="phone"
                value={input.phone}
                onChange={hdlChange}
              />
            </label>
          </div>
          <div className="w-full sm:w-1/3 p-1">
            <label className="form-control w-full max-w rounded-full">
              <div className="label">
                <span className="label font-bold">อีเมล</span>
              </div>
              <input
                className="input input-bordered w-4/5 max-w-lg rounded-2xl border-gray-400"
                type="text"
                name="email"
                value={input.email}
                onChange={hdlChange}
              />
            </label>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            className="text-white bg-gradient-to-br from-yellow-300 to-yellow-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-yellow-200 dark:focus:ring-yellow-800 font-medium rounded-3xl text-sm px-5 py-2.5 text-center mr-4 mb-2 w-48 shadow-xl"
            onClick={hdlSubmit}
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
