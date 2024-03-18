import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";

import { useEffect, useState } from "react";
import axios from "axios";

const guestNav = [{ to: "/" }];

const userNav = [{ to: "/", text: "Home" }];

export default function updateProfile() {
  const { user, logout } = useAuth();
  const finalNav = user?.user_id ? userNav : guestNav;

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
        `http://localhost:8889/auth/${user.user_id}`,
        output,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("แก้ไขข้อมูลเรียบร้อยแล้ว");
      location.reload();
    } catch (err) {
      alert(err.message);
    }
  };


  return (
    <div className="text-center h-sreen">
      <p className="text-3xl pt-28 font-bold">
        แก้ไขบัญชีของ <label className="text-3xl pt-24 text-red-600">{user?.user_id ? user.username : "Guest"}</label>
      </p>

      <hr className="border-t border-sky-500 my-2  justify-center flex m-36 " />
      <form className="ml-96">
        <div className="justify-start p-14 flex flex-wrap">
          <label className="form-control w-full max-w rounded-full">
            <div className="label">
              <span className="label font-bold">ชื่อผู้ใช้ :</span>
            </div>
            <input
              className="input input-bordered input-info w-full max-w-lg rounded-full"
              type="text"
              name="username"
              value={input.username}
              onChange={hdlChange}
            />
          </label>

          <label className="form-control w-full max-w rounded-full">
            <div className="label">
              <span className="label font-bold">ชื่อ :</span>
            </div>
            <input
              className="input input-bordered input-info w-full max-w-lg flex rounded-full"
              type="text"
              name="firstname"
              value={input.firstname}
              onChange={hdlChange}
            />
          </label>

          <label className="form-control w-full max-w rounded-full">
            <div className="label">
              <span className="label font-bold">นามสกุล :</span>
            </div>
            <input
              className="input input-bordered input-info w-full max-w-lg flex rounded-full"
              type="text"
              name="lastname"
              value={input.lastname}
              onChange={hdlChange}
            />
          </label>
          <label className="form-control w-full max-w rounded-full">
            <div className="label">
              <span className="label font-bold">ที่อยู่ :</span>
            </div>
            <input
              className="input input-bordered input-info w-full max-w-lg flex rounded-full"
              type="text"
              name="address"
              value={input.address}
              onChange={hdlChange}
            />
          </label>
          <label className="form-control w-full max-w rounded-full">
            <div className="label">
              <span className="label font-bold">เบอร์โทรศัพท์ :</span>
            </div>
            <input
              className="input input-bordered input-info w-full max-w-lg flex rounded-full"
              type="text"
              name="phone"
              value={input.phone}
              onChange={hdlChange}
            />
          </label>
          <label className="form-control w-full max-w rounded-full">
            <div className="label">
              <span className="label font-bold">อีเมล :</span>
            </div>
            <input
              className="input input-bordered input-info w-full max-w-lg flex rounded-full"
              type="text"
              name="email"
              value={input.email}
              onChange={hdlChange}
            />
          </label>

          <div className="mt-10">
          <button onClick={hdlSubmit} type="button" class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">บันทึกการแก้ไข</button>
          </div>

        </div>
      </form>
    </div>
  );
}
