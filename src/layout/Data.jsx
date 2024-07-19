import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTable,
  faClipboardList,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function Data() {
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-info drawer-button lg:hidden text-white mt-5 font-normal"
          >
            ดูข้อมูล
          </label>

          <div
            className="hero min-h-screen w-full h-full"
            style={{
              backgroundImage:
                "url(https://nocnoc.com/blog/wp-content/uploads/2021/03/cover-dining-table-decorate.jpg)",
            }}
          >
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
              <div className="max-w-md"></div>
            </div>
          </div>
        </div>

        <div className="drawer-side mt-20 overflow-y-hidden">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-60 min-h-full bg-gradient-to-r from-sky-100 to-sky-400">
            <li>
              <Link to="/DataUser">
                <FontAwesomeIcon icon={faUser} className="mr-2" /> ข้อมูลผู้ใช้
              </Link>
            </li>
            <li>
              <Link to="/DataType">
                <FontAwesomeIcon icon={faTable} className="mr-2" />{" "}
                ข้อมูลประเภทโต๊ะ
              </Link>
            </li>
            <li>
              <Link to="/DataTable">
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />{" "}
                ข้อมูลโต๊ะ
              </Link>
            </li>
            <li>
              <Link to="/DataBooking">
                <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />{" "}
                ข้อมูลการจอง
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
