import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate()
  const [input, setInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    email: "",
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
    });
  };

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      if (input.password !== input.confirmPassword) {
        return alert("pls check confirm password");
      }
      const rs = await axios.post("http://localhost:8889/auth/register", input);
      console.log(rs);
      if (rs.status === 200) {
        alert("ลงทะเบียนสำเร็จ");
        navigate('/login')
      }
    } catch (err) {
      console.log(err.message);
    }
    // alert(999)
  };

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://nocnoc.com/blog/wp-content/uploads/2021/03/22-dining-table-decorate.jpg)",
      }}
    >
      <div className="flex justify-center items-center p-16 border border w-8/10 min-w-[500px] mx-auto bg-white rounded-lg mt-16 mb-16">
        <form className="text-3xl mb-2 w-full" onSubmit={hdlSubmit}>
        <div className="">
              <img
                src="https://marketplace.1c-bitrix.ru/upload/update/a22/1421081294_add_user.png"
                className=""
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          <div className="text-3xl font-bold mb-4 mt-2 text-info">
            สมัครสมาชิก
          </div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">ชื่อผู้ใช้</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-11/12"
              name="username"
              value={input.username}
              onChange={hdlChange}
            />
          </label>
          <label className="form-control w-full w-full">
            <div className="label">
              <span className="label-text">รหัสผ่าน</span>
            </div>
            <input
              type="password"
              className="input input-bordered w-11/12"
              name="password"
              value={input.password}
              onChange={hdlChange}
            />
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">ยืนยันรหัสผ่าน</span>
            </div>
            <input
              type="password"
              className="input input-bordered w-11/12 "
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={hdlChange}
            />
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">ชื่อ</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-11/12"
              name="firstname"
              value={input.firstname}
              onChange={hdlChange}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">นามสกุล</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-11/12"
              name="lastname"
              value={input.lastname}
              onChange={hdlChange}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">ที่อยู่</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-11/12"
              name="address"
              value={input.address}
              onChange={hdlChange}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">เบอร์โทรศัพท์</span>
            </div>
            <input
              type="tel"
              className="input input-bordered w-11/12"
              name="phone"
              value={input.phone}
              onChange={hdlChange}
            />
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">อีเมล</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-11/12"
              name="email"
              value={input.email}
              onChange={hdlChange}
            />
          </label>
          <div className="flex gap-10 justify-center items-center">
            <button type="submit" className="btn btn-outline btn-info mt-7">
              สมัครสมาชิก
            </button>
            <button
              type="reset"
              className="btn btn-outline btn-warning mt-7"
              onClick={hdlReset}
            >
              รีเซ็ต
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
