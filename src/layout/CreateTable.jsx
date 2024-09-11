import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faChair,
  faDollarSign,
  faTag,
  faSave,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function CreateTable() {
  const navigate = useNavigate();
  const fileInput = useRef(null);
  const [fileName, setFileName] = useState("ยังไม่ได้เลือกไฟล์");
  const [selectFile, setSelectFile] = useState(null);
  const [typeTable, setTypeTable] = useState([]);
  const [tables, setTables] = useState({
    table_name: "",
    table_status: "FREE",
    table_seat: "",
    table_price: "",
    type_name: "1",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchTypes = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:8889/admin/types`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTypeTable(response.data.types);
      } catch (error) {
        console.error("Error fetching table types:", error);
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถดึงข้อมูลประเภทโต๊ะได้",
          confirmButtonColor: "#3996fa",
        });
      }
    };
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    setTables((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const checkTableNameUnique = async (name) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8889/admin/tables/check`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { name },
        }
      );
  
      return response.data.isUnique;
    } catch (err) {
      console.error("Error checking table name uniqueness:", err.response ? err.response.data : err.message);
      // Swal.fire({
      //   icon: "error",
      //   title: "เกิดข้อผิดพลาดในการตรวจสอบชื่อโต๊ะ",
      //   text: err.response ? err.response.data.error : err.message,
      //   confirmButtonColor: "#3996fa",
      // });
      return false;
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tables.table_name || !tables.table_seat || !tables.table_price) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        confirmButtonColor: "#3996fa",
      });
      return;
    }

    const file = fileInput.current.files[0];
    const formData = new FormData();

    Object.entries(tables).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (file) {
      formData.append("image", file);
    }

    const isUnique = await checkTableNameUnique(tables.table_name);
    if (isUnique) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลซ้ำ",
        text: "ชื่อโต๊ะนี้มีอยู่แล้ว กรุณาเลือกชื่ออื่น",
        showCancelButton: false,
        confirmButtonText: "ปิด",
        confirmButtonColor: "#dc3545",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8889/admin/tables", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: "success",
        title: "คุณได้เพิ่มข้อมูลโต๊ะเรียบร้อยแล้ว",
        confirmButtonColor: "#3996fa",
      });
      navigate("/DataTable");
    } catch (err) {
      console.log("Error submitting table:", err.response.data);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด: " + err.response.data.msg,
        confirmButtonColor: "#3996fa",
      });
    } finally {
      setLoading(false);
    }
  };

  const hdlChangeFile = () => {
    const file = fileInput.current.files[0];
    setSelectFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("ยังไม่ได้เลือกไฟล์");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-bl from-sky-400 to-white">
      <div className="flex absolute top-0 left-0 mt-20">
        <Link to="/DataTable" className="text-black rounded-4xl p-2">
          <i className="fas fa-arrow-left"></i>
        </Link>
      </div>
      <form
        className="flex flex-col min-w-[750px] h-[670px] border border-gray-500 w-3/5 mx-auto p-12 gap-4 mt-16 rounded-xl shadow-2xl bg-white"
        onSubmit={handleSubmit}
      >
        <div className="text-3xl font-bold [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-gray-500">
          เพิ่มข้อมูลโต๊ะ
        </div>
        <div className="mt-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">
                <FontAwesomeIcon icon={faImage} className="mr-2" />
                รูป
              </span>
            </div>
            <label
              className="block text-gray-700 text-sm font-bold mt-4"
              htmlFor="fileInput"
            >
              เลือกไฟล์ :
            </label>
            <input
              type="file"
              className="file-input file-input-bordered file-input-xs w-full h-6 max-w-xs flex col-auto mt-4"
              ref={fileInput}
              onChange={hdlChangeFile}
            />
            <span className="ml-2 mt-1 font-bold">
              {selectFile ? selectFile.name : "ยังไม่ได้เลือกไฟล์"}
            </span>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 w-36 h-auto border border-gray-300 rounded"
              />
            )}
          </label>
          <div className="mt-full grid grid-cols-2 gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-bold">
                  <FontAwesomeIcon icon={faChair} className="mr-2" />
                  ชื่อโต๊ะ
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-96 h-11 pl-5 text-sm"
                name="table_name"
                value={tables.table_name}
                onChange={handleChange}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-bold">
                  <FontAwesomeIcon icon={faTable} className="mr-2" />
                  จำนวนที่นั่ง
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-96 h-11 pl-5 text-sm"
                name="table_seat"
                value={tables.table_seat}
                onChange={handleChange}
                pattern="\d*"
                title="กรุณาใส่ตัวเลขเท่านั้น"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-bold">
                  <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                  ราคา
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-96 h-11 pl-5 text-sm"
                name="table_price"
                value={tables.table_price}
                onChange={handleChange}
                pattern="\d*"
                title="กรุณาใส่ตัวเลขเท่านั้น"
              />
            </label>
            <label className="form-control w-80 max-w-full">
              <div className="label">
                <span className="label-text font-bold">
                  <FontAwesomeIcon icon={faTag} className="mr-2" />
                  ประเภท
                </span>
              </div>
              <select
                className="select select-bordered h-11"
                onChange={handleChange}
                name="type_name"
                value={tables.type_name}
              >
                {typeTable.map((el) => (
                  <option key={el.type_id} value={el.type_id}>
                    {el.type_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="justify-center mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white w-36 h-12 font-normal rounded-3xl drop-shadow-xl text-sm"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSave} className="mr-2 text-sm" />{" "}
              {loading ? "บันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
