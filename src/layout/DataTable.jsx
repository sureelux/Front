import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function DataTable() {
  const [tables, setTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getTables = async (req, res, next) => {
      const rs = await axios.get("http://localhost:8889/admin/tables");
      setTables(rs.data.tables);
    };
    getTables();
  }, []);

  const hdlDelete = async (e, table_id) => {
    try {
      e.stopPropagation();
      const token = localStorage.getItem("token");
      const rs = await axios.delete(
        `http://localhost:8889/admin/deleteTable/${table_id}`,
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
        <div className="drawer-content flex flex-col items-center">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-info drawer-button lg:hidden text-white font-normal mt-5"
          >
            ดูข้อมูล
          </label>
          <div className="overflow-autos w-full h-screen">
            <p className="mt-2 ml-2 text-3xl font-bold">ข้อมูลโต๊ะ</p>
            <form class="max-w-md mx-auto mr-28">
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    class="w-4 h-4 text-gray-400 dark:text-gray-400"
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
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="default-search"
                  className="block w-96 p-3 ps-10 text-sm text- border border-gray-300 rounded-lg bg-gray-50  dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ค้นหา.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            {/* {JSON.stringify(tables)} */}
            <table className="table table-zebra text-xs mt-4">
              <thead>
                <tr className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-white">
                  <th>ลำดับ</th>
                  <th>ภาพ</th>
                  <th>ชื่อโต๊ะ</th>
                  <th>สถานะโต๊ะ</th>
                  <th>ราคา</th>
                  <th>ประเภทโต๊ะ</th>
                  <th>ตัวเลือก</th>
                </tr>
              </thead>
              <tbody className="font-medium text-black">
                {tables
                  .filter(
                    (table) =>
                      table.table_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      (table.table_price &&
                        typeof table.table_price === "string" &&
                        table.table_price
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())) ||
                      table.type_table.type_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      (table.table_status === "FREE" &&
                        "ว่าง".includes(searchTerm.toLowerCase())) ||
                      (table.table_status === "BUSY" &&
                        "ไม่ว่าง".includes(searchTerm.toLowerCase()))
                  )
                  .map((tables) => (
                    <tr key={tables.table_id} tables={tables}>
                      <td>{tables.table_id}</td>
                      <td>
                        <figure>
                          <img
                            src={tables.table_img}
                            className="max-w-32 rounded-lg shadow-lg"
                          />
                        </figure>
                      </td>
                      <td>{tables.table_name}</td>
                      <td
                        className={
                          tables.table_status === "FREE"
                            ? "text-green-500"
                            : tables.table_status === "BUSY"
                            ? "text-red-500 font-medium"
                            : ""
                        }
                      >
                        {tables.table_status === "FREE"
                          ? "ว่าง"
                          : tables.table_status === "BUSY"
                          ? "ไม่ว่าง"
                          : ""}
                      </td>
                      <td>{tables.table_price}</td>
                      <td>{tables.type_table.type_name}</td>
                      <td>
                        <button
                          className="btn btn-warning text-black text-xs font-normal rounded-xl shadow-xl"
                          style={{ marginRight: "20px" }}
                          onClick={() =>
                            document
                              .getElementById(`my_modal_${tables.table_id}`)
                              .showModal()
                          }
                        >
                          แก้ไข
                        </button>

                        <button
                          className="btn btn-error text-white text-xs font-normal rounded-xl shadow-xl"
                          onClick={() =>
                            document.getElementById("my_modal_1").showModal()
                          }
                        >
                          ลบ
                        </button>
                        <dialog id="my_modal_1" className="modal">
                          <div className="modal-box">
                            <h3 className="font-bold text-lg">
                              คุณต้องการลบข้อมูลหรือไม่?
                            </h3>
                            <div className="modal-action">
                              <button
                                className="btn"
                                onClick={() =>
                                  document.getElementById("my_modal_1").close()
                                }
                              >
                                ยกเลิก
                              </button>
                              <button
                                className="btn btn-error text-white"
                                onClick={(e) => hdlDelete(e, tables.table_id)}
                              >
                                ลบ
                              </button>
                            </div>
                          </div>
                        </dialog>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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
      {tables.map((table, index) => (
        <Modal key={index} table={table} />
      ))}
    </div>
  );
}
const Modal = ({ table }) => {
  const modalId = `my_modal_${table.table_id}`;
  console.log(modalId);
  const [editData, setEditData] = useState({
    table_img: "",
    table_name: "",
    table_status: "",
    table_price: "",
  });
  const [isEditing, setEditing] = useState(false);

  const handleEditCilck = () => {
    setEditData({ ...table });
    setEditing(true);
  };

  const handleSaveClick = async (e) => {
    setEditing(false);
    try {
      e.stopPropagation();
      const table_id = table.table_id;

      const apiUrl = `http://localhost:8889/admin/updeteTable/${table_id}`;

      await axios.patch(apiUrl, editData);

      location.reload();
      setEditing(false);
      document.getElementById(modalId).close();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแก้ไข", error);
    }
  };

  const handleChange = (e) => {
    setEditData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <dialog id={modalId} className="modal">
      {console.log(modalId)}
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-5">แก้ไขข้อมูลประเภทโต๊ะ</h3>
        <h3 className="text-lg mb-5 w-50">
          ภาพ :{" "}
          {isEditing ? (
            <input
              type="text"
              name="table_img"
              value={editData.table_img}
              onChange={handleChange}
            ></input>
          ) : (
            table.table_img
          )}
        </h3>
        <h3 className="text-lg mb-5">
          ชื่อโต๊ะ :{" "}
          {isEditing ? (
            <input
              type="text"
              name="table_name"
              value={editData.table_name}
              onChange={handleChange}
            ></input>
          ) : (
            table.table_name
          )}
        </h3>
        <h3 className="text-lg mb-5">
          สถานะ :{" "}
          {isEditing ? (
            <input
              type="text"
              name="table_status"
              value={editData.table_status}
              onChange={handleChange}
            ></input>
          ) : (
            table.table_status
          )}
        </h3>
        <h3 className="text-lg mb-5">
          ราคา :{" "}
          {isEditing ? (
            <input
              type="text"
              name="table_price"
              value={editData.table_price}
              onChange={handleChange}
            ></input>
          ) : (
            table.table_price
          )}
        </h3>

        <div className="flex justify-end">
          {isEditing ? (
            <button
              className=" btn btn-accent text-white"
              onClick={handleSaveClick}
            >
              บันทึก
            </button>
          ) : (
            <button className=" btn btn-warning" onClick={handleEditCilck}>
              แก้ไข
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => document.getElementById(modalId).close()}>
          Close
        </button>
      </form>
    </dialog>
  );
};
