import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DataBooking() {
  const [bookings, setBookings] = useState([]);
  // const time  = new Date(bookings.booking_datatime);
  // const day = time.toDateString('th-TH')
  console.log(bookings);

  useEffect(() => {
    const getBookings = async (req, res, next) => {
      const rs = await axios.get("http://localhost:8889/admin/bookings");
      setBookings(rs.data.bookings);
    };
    getBookings();
    console.log(bookings);
  }, []);

  const hdlDelete = async (e, booking_id) => {
    try {
      e.stopPropagation();
      const token = localStorage.getItem("token");
      const rs = await axios.delete(
        `http://localhost:8889/admin/deleteBooking/${booking_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      location.reload();
      setTrigger((prv) => !prv);
    } catch (err) {
      console.log(err);
    }
  };

  function FormatDate(dateString) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options);
  }

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
          <div className="overflow-autos w-full h-screen">
            <p className="mt-2 ml-2 text-3xl font-bold">ข้อมูลการจอง</p>
            <table className="table table-zebra mt-4">
              <thead>
                <tr className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-white">
                  <th>ลำดับ</th>
                  <th>วันที่/เวลา</th>
                  <th>ชื่อโต๊ะ</th>
                  <th>ประเภทโต๊ะ</th>
                  <th>ชื่อลูกค้า</th>
                  <th>สถานะ</th>
                  <th>ตัวเลือก</th>
                </tr>
              </thead>
              <tbody className="font-medium text-black">
                {bookings.map((bookings) => (
                  <tr key={bookings.booking_id} bookings={bookings}>
                    <td>{bookings.booking_id}</td>
                    <td>
                      {new Date(bookings.booking_datatime).toLocaleString(
                        "th-TH"
                      )}
                    </td>
                    <td>{bookings.table.table_name}</td>
                    <td>{bookings.table.type_table.type_name}</td>
                    <td>{bookings.user.firstname}</td>
                    <td className={bookings.status_booking === 'APPROVE' ? 'text-green-500' : bookings.status_booking === 'NOT_APPROVED' ? 'text-red-500 font-medium' : bookings.status_booking === 'WAIT' ? 'text-yellow-400 font-medium' : ''}>
                      {bookings.status_booking === "APPROVE"
                        ? "อนุมัติ"
                        : bookings.status_booking === "NOT_APPROVED"
                        ? "ไม่อนุมัติ"
                        : bookings.status_booking === "WAIT"
                        ? "รออนุมัติ"
                        : ""}
                    </td>
                    <td>
                      <button
                        className={`${
                          bookings.status_booking === "APPROVE"
                            ? "btn btn-success text-xs rounded-xl shadow-xl"
                            : bookings.status_booking === "NOT_APPROVED"
                            ? "btn btn-error text-xs rounded-xl shadow-xl"
                            : "btn btn-warning text-xs rounded-xl shadow-xl"
                        }`}
                        onClick={() =>
                          document
                            .getElementById(`my_modal_${bookings.booking_id}`)
                            .showModal()
                        }
                      >
                        <svg
                          className="w-5 h-5 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 1v3m5-3v3m5-3v3M1 7h7m1.506 3.429 2.065 2.065M19 7h-2M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm6 13H6v-2l5.227-5.292a1.46 1.46 0 0 1 2.065 2.065L8 16Z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.map((booking, index) => (
              <Modal key={index} booking={booking} />
            ))}
          </div>
        </div>

        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-60 min-h-full bg-sky-100 text-black">
            <li>
              <Link to="/DataUser">ข้อมูลผู้ใช้</Link>
            </li>
            <li>
              <Link to="/DataType">ข้อมูลประเภทโต๊ะ</Link>
            </li>
            <li>
              <Link to="/DataTable">ข้อมูลโต๊ะ</Link>
            </li>
            <li>
              <Link to="/DataBooking">ข้อมูลการจอง</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const Modal = ({ booking }) => {
  const modalId = `my_modal_${booking.booking_id}`;
  let token = localStorage.getItem("token");

  const hdlModalAccept = async (mid, id, bid) => {
    const data = { table_status: "BUSY" };
    const data2 = { status_booking: "APPROVE" };
    const rs = await axios.patch(
      `http://localhost:8889/admin/updeteStatus/${id}`,
      data
    );
    const rs2 = await axios.patch(
      `http://localhost:8889/admin/updeteStatusBooking/${bid}`,
      data2
    );
    if (rs2.status === 200 && rs.status === 200) {
      document.getElementById(mid).close();
      location.reload();
    }
  };

  const hdlModalCancel = async (mid, id, bid) => {
    const data = { table_status: "FREE" };
    const data2 = { status_booking: "NOT_APPROVED" };
    const rs = await axios.patch(
      `http://localhost:8889/admin/updeteStatus/${id}`,
      data
    );
    const rs2 = await axios.patch(
      `http://localhost:8889/admin/updeteStatusBooking/${bid}`,
      data2
    );
    if (rs2.status === 200 && rs.status === 200) {
      document.getElementById(mid).close();
      location.reload();
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 border bg-red-500 text-white ">
            ✕
          </button>
        </form>
        <svg class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-red-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
        <h3 className="font-bold text-xl text-center ">
          คุณต้องการอนุมัติการจองหรือไม่?
        </h3>
        <div className="mt-8 flex justify-center">
          <button
            className="btn btn-success text-white font-normal mr-5 rounded-xl"
            onClick={() =>
              hdlModalAccept(
                modalId,
                booking.table.table_id,
                booking.booking_id
              )
            }
          >
            อนุมัติ
          </button>
          <button
            className="btn btn-error text-white font-normal rounded-xl"
            onClick={() =>
              hdlModalCancel(
                modalId,
                booking.table.table_id,
                booking.booking_id
              )
            }
          >
            ไม่อนุมัติ
          </button>
        </div>
      </div>
    </dialog>
  );
};
