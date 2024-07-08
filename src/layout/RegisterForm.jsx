import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    email: "",
    role: "USER",
  });

  const hdlReset = () => {
    setInput({
      username: "",
      password: "",
      confirmPassword: "",
      firstname: "",
      lastname: "",
      address: "",
      phone: "",
      email: "",
      role: "USER",
    });
  };

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      if (input.password !== input.confirmPassword) {
        return alert("กรุณาตรวจสอบรหัสผ่านอีกครั้ง");
      }
      const rs = await axios.post("http://localhost:8889/auth/register", input);
      console.log(rs);
      if (rs.status === 200) {
        alert("คุณได้ลงทะเบียนสำเร็จแล้ว");
        navigate("/login");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://nocnoc.com/blog/wp-content/uploads/2021/03/22-dining-table-decorate.jpg)",
      }}
    >
      <div className="flex justify-center items-center p-14 border w-11/12 min-w-[500px] mx-auto bg-white rounded-lg mt-24
      
      mb-16">
        <form className="text-3xl mb-2 w-full" onSubmit={hdlSubmit}>
          <div className="flex flex-col ">
            <img
              src="https://marketplace.1c-bitrix.ru/upload/update/a22/1421081294_add_user.png"
              style={{ width: "100px", height: "100px" }}
            />
            <div className="text-3xl font-bold mb-4 mt-2 text-sky-500">
              สมัครสมาชิก
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-bold">ชื่อผู้ใช้ : </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                name="username"
                value={input.username}
                onChange={hdlChange}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-bold">รหัสผ่าน : </span>
              </div>
              <input
                type="password"
                className="input input-bordered w-full"
                name="password"
                value={input.password}
                onChange={hdlChange}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-bold">ยืนยันรหัสผ่าน : </span>
              </div>
              <input
                type="password"
                className="input input-bordered w-full"
                name="confirmPassword"
                value={input.confirmPassword}
                onChange={hdlChange}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-bold">ชื่อ : </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                name="firstname"
                value={input.firstname}
                onChange={hdlChange}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-bold">นามสกุล</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                name="lastname"
                value={input.lastname}
                onChange={hdlChange}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-bold">ที่อยู่ : </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                name="address"
                value={input.address}
                onChange={hdlChange}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-bold">เบอร์โทรศัพท์ : </span>
              </div>
              <input
                type="tel"
                className="input input-bordered w-full"
                name="phone"
                value={input.phone}
                onChange={hdlChange}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-bold">อีเมล : </span>
              </div>
              <input
                type="email"
                className="input input-bordered w-full"
                name="email"
                value={input.email}
                onChange={hdlChange}
              />
            </label>
          </div>
          <div className="flex gap-5 justify-end items-end mt-3">
          <button type="submit" className="btn btn-outline btn-info">
              สมัครสมาชิก
            </button>
            <button
              type="reset"
              className="btn btn-warning font-normal  text-white"
              onClick={hdlReset}
            >
              รีเซ็ต
            </button>
            <Link to="/login" className="btn btn-error font-normal text-white">
              ย้อนกลับ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
