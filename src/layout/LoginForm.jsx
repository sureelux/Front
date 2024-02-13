import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import userAuth from "../hooks/userAuth";

export default function LoginForm() {
  const { setUser } = userAuth();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      const rs = await axios.post("http://localhost:8889/auth/login", input);
      console.log(rs.data.token);
      localStorage.setItem("token", rs.data.token);
      const rs1 = await axios.get("http://localhost:8889/auth/me", {
        headers: { Authorization: `Bearer ${rs.data.token}` },
      });
      console.log(rs1.data);
      setUser(rs1.data);
    } catch (err) {
      console.log(err.message);
    }
    // alert(999)
  };

  return (
    <div className="hero min-h-screen" style={{backgroundImage: 'url(https://nocnoc.com/blog/wp-content/uploads/2021/03/12-dining-table-decorate.jpg)'}}>   
       <div className="skeleton w-32 h-32"></div>
        <div className=" container mx-auto flex justify-center items-center h-scree">
        <div className="card shrink-0 w-full max-w-sm shadow-3xl bg-base-100">
          <form className="card-body" onSubmit={hdlSubmit}>
            <div className="justify-center">
              <img
                src="https://pic.onlinewebfonts.com/thumbnails/icons_568656.svg"
                className=""
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <h1 className="text-2xl font-bold text-center text-info" >
              เข้าสู่ระบบ
            </h1>
            <div className="form-control">
              <label className="label">
                <span className="label-text">ชื่อผู้ใช้</span>
              </label>

              <input
                type="text"
                className="input input-bordered"
                name="username"
                value={input.username}
                onChange={hdlChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">รหัสผ่าน</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                name="password"
                value={input.password}
                onChange={hdlChange}
              />
            </div>
            <div className="form-control mt-8">
              <button className="btn btn-info text-white font-medium">เข้าสู่ระบบ</button>
              <div className="divider text-xs font-thin">หรือ</div>
              <Link to="/register" className="btn btn-neutral-content form-control mt-1 font-medium">สมัครสมาชิก</Link>
            </div>
          </form>
        </div>
        </div>
      </div>
  );
}
