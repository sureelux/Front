import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";

const guestNav = [
  { to: "/", text: "เข้าสู่ระบบ" },
  { to: "/register", text: "สมัครสมาชิก" }
];

const userNav = [
  { to: "/", text: "หน้าหลัก" },
  { to: "/new", text: "new Todo" }
];

const adminNav = [
  { to: "/", text: "หน้าหลัก" },
  { to: "/new", text: "new Todo" }
];

export default function HeaderAdmin() {
  const { user, logout, setTheme } = useAuth();
  const finalRouter = user?.user_id ? user.role === "ADMIN" ? adminNav : userNav : guestNav;

  const navigate = useNavigate();
  
  const hdlLogout = () => {
    logout();
    navigate("/");
  };

  const hdlProduct = () => {
    navigate("/Product");
  };

  const hdlDataUser = () => {
    navigate("/DataUser");
  };

  return (
    <div className="navbar bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="flex-1">
        {/* สวัสดี, {user?.user_id ? user.username : 'Guest'} */}
        <div className="navbar">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white-100 rounded-box w-52">
                <li>
                  <a onClick={hdlDataUser}>ข้อมูลผู้ใช้</a>
                </li>
                <li>
                  <a>ติดต่อเรา</a>
                </li>
              </ul>
            </div>
            <a className="btn btn-ghost text-xl text-white">ผู้ดูแลระบบ</a>
          </div>
          <div className="navbar-center hidden lg:flex text-white ">
            <ul className="menu menu-horizontal px-1 bg-white-100">
            <li>
                <a onClick={hdlDataUser}>ข้อมูลผู้ใช้</a>
              </li>
              <li>
                <a>ติดต่อเรา</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {user?.user_id && (
            <li>
              <Link to="#" onClick={hdlLogout} style={{ color: "white" }}>
                ออกจากระบบ
              </Link>
            </li>
          )}
        </ul>
        <div className="avatar online">
          <div className="w-10 rounded-full">
            <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
}
