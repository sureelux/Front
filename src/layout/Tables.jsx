import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userAuth from "../hooks/userAuth";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/core";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [types, setTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  const { user } = userAuth();
  const navigate = useNavigate();

  const imageArr = [
    "https://sabuyjaishop.com/shop/wallbkk/images/zvvkhk20wyxtple30kjx1782021223017902.jpg",
    "https://www.bloggang.com/data/t/tathaitravel/picture/1659527277.jpg",
    "https://www.bloggang.com/data/t/tathaitravel/picture/1659527299.jpg",
    "https://www.bloggang.com/data/t/tathaitravel/picture/1659527244.jpg",
    "https://www.ryoiireview.com/upload/article/201912/1575460965_f7e90e57514ef13099ad72d91271cfc5.jpg",
    "https://nocnoc.com/blog/wp-content/uploads/2020/12/shape-table.jpg",
    "https://nocnoc.com/blog/wp-content/uploads/2023/01/10_how-to-start-a-restaurant-business.jpg",
    "https://nocnoc.com/blog/wp-content/uploads/2023/01/07_how-to-start-a-restaurant-business.jpg",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const fetchTables = axios.get("http://localhost:8889/user/tables", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const fetchTypes = axios.get("http://localhost:8889/admin/types", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const [tablesResponse, typesResponse] = await Promise.all([
          fetchTables,
          fetchTypes,
        ]);

        setTables(tablesResponse.data.tables);
        setTypes(typesResponse.data.types);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchTablesUser = async () => {
      try {
        const response = await axios.get("http://localhost:8889/get");
        setTables(response.data.tables);
      } catch (error) {
        console.error("Error fetching user tables:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchData();
    } else {
      fetchTablesUser();
    }
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTables = tables?.filter((table) =>
    table.table_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBooking = (id) => {
    user?.user_id ? navigate(`/BookingTable/${id}`) : navigate("/login");
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < Math.ceil(filteredTables.length / itemsPerPage)
        ? prevPage + 1
        : prevPage
    );
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTables = filteredTables?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center mt-20">
        <div className="max-w-[200rem] mx-auto">
          <Splide
            options={{
              rewind: true,
              autoplay: true,
              interval: 3000,
              perPage: 4,
              perMove: 1,
              speed: 500,
              gap: "0rem",
              focus: "center",
              type: "loop",
              pagination: false,
            }}
            aria-label="slide images"
          >
            {imageArr.map((src, index) => (
              <SplideSlide key={index}>
                <div className="h-[280px]">
                  <img
                    src={src}
                    alt={`Slide ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>
        <div className="flex items-center justify-center text-4xl font-bold shadow-xl bg-gradient-to-r from-blue-600 via-teal-400 to-green-400 text-white p-8 text-center w-full h-[90px]">
          <div className="animate-pulse [text-shadow:2px_1px_6px_var(--tw-shadow-color)] shadow-gray-700">
            โต๊ะอาหารทั้งหมด
          </div>
        </div>

        <div className="flex justify-center items-center my-4 ml-auto me-4">
          <label
            htmlFor="search"
            className="text-lg font-bold text-gray-700 dark:text-gray-300 mr-2"
          >
            ค้นหา :
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="p-2 pl-10 border border-gray-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm w-64"
              placeholder="ค้นหาโต๊ะอาหาร...."
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
          </div>
        </div>

        <div className="relative my-2 w-full mt-3">
          <hr className="absolute top-0 left-0 w-full h-1 rounded-full animate-pulse bg-gradient-to-r from-gray-300 to-gray-600" />
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-transparent animated-gradient"></div>
        </div>

        <div className="max-w-[100rem] mx-auto gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {paginatedTables.length > 0 ? (
            paginatedTables.map((item) => (
              <div
                key={item.table_id}
                className="card-body items-center text-center"
              >
                <div className="card w-80 border-2 border-gray-500 shadow-2xl bg-white bg-[url('path-to-your-pattern.png')] bg-contain bg-no-repeat">
                  <figure className="px-10 pt-10 hover:scale-110 transition-transform duration-300 ease-in-out">
                    <img src={item.table_img} alt={item.table_name} />
                  </figure>
                  <div className="flex flex-col gap-4 mt-2 p-4">
                    <h3 className="text-3xl font-bold">{item.table_name}</h3>
                    <p className="text-2xl font-bold">
                      ราคา:{" "}
                      <span className="text-red-600 text-xl font-bold">
                        {item.table_price}
                      </span>{" "}
                      บาท
                    </p>
                    <h3 className="font-bold">
                      ประเภท:{" "}
                      <span className="text-base font-normal">
                        {item.type_table.type_name}
                      </span>
                    </h3>
                    <h3 className="font-bold">
                      สถานะ:{" "}
                      <span
                        className={`text-base font-normal ${
                          item.table_status === "FREE"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.table_status === "FREE" ? "ว่าง" : "ไม่ว่าง"}
                      </span>
                    </h3>
                    <div className="card-actions mx-auto px-4 text-center">
                      <button
                        disabled={item.table_status === "BUSY"}
                        onClick={() => handleBooking(item.table_id)}
                        className="text-white bg-gradient-to-r from-blue-500 to-blue-400 hover:bg-gradient-to-l focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transition-colors duration-300"
                      >
                        จอง
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-20 text-2xl text-gray-700 font-medium">
              ไม่พบข้อมูลโต๊ะอาหาร
            </div>
          )}
        </div>

        <div className="flex justify-center items-center mt-4 mx-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <span className="text-xl font-semibold px-4">
            หน้า {currentPage} /{" "}
            {Math.ceil(filteredTables.length / itemsPerPage)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={
              currentPage === Math.ceil(filteredTables.length / itemsPerPage)
            }
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              currentPage === Math.ceil(filteredTables.length / itemsPerPage)
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            <FaArrowRight className="text-xl" />
          </button>
        </div>

        <footer class="bg-gradient-to-tl bg-sky-600 from-orange-100 via-cyan-400 text-white py-8 w-full mt-3">
          <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 class="text-xl font-semibold mb-4">ชื่อร้าน</h3>
                <p>จองโต๊ะอาหารออนไลน์ที่ง่ายและสะดวก</p>
              </div>

              <div>
                <h3 class="text-xl font-semibold mb-4">ลิงก์ด่วน</h3>
                <ul>
                  <li>
                    <a href="/UserHome" class="hover:underline">
                      หน้าแรก
                    </a>
                  </li>
                  <li>
                    <a href="/tables" class="hover:underline">
                      เลือกดูโต๊ะอาหาร
                    </a>
                  </li>
                  <li>
                    <a href="/contact" class="hover:underline">
                      ติดต่อเรา
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 class="text-xl font-semibold mb-4">ติดต่อเรา</h3>
                <p>282 ตำบลมหาชัย อำเภอปลาปาก จังหวัดนครพนม</p>
                <p>โทร: 065-539-0921</p>
                <p>Email: sureelux.pa64@snru.ac.th</p>
              </div>

              <div>
                <h3 class="text-xl font-semibold mb-4">ติดตามเรา</h3>
                <div class="flex space-x-4">
                  <a
                    href="https://www.linkedin.com/in/sureelux-pangkhamhak-7b68962a1/"
                    class="text-white hover:text-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.675 0h-21.35c-.736 0-1.325.589-1.325 1.325v21.351c0 .735.589 1.324 1.325 1.324h21.351c.736 0 1.324-.589 1.324-1.324v-21.351c0-.736-.588-1.325-1.324-1.325zm-13.75 20.25h-3.5v-11h3.5v11zm-1.75-12.5c-1.138 0-2.063-.924-2.063-2.062s.925-2.062 2.063-2.062c1.138 0 2.063.924 2.063 2.062s-.925 2.062-2.063 2.062zm13.75 12.5h-3.5v-5.847c0-1.395-.025-3.189-1.945-3.189-1.946 0-2.244 1.521-2.244 3.089v5.947h-3.5v-11h3.356v1.507h.049c.467-.882 1.607-1.811 3.307-1.811 3.54 0 4.191 2.33 4.191 5.359v6.945z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=100021929414668&locale=th_TH"
                    class="text-white hover:text-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c-5.523 0-10 4.477-10 10 0 4.991 3.657 9.128 8.438 9.878v-6.993h-2.54v-2.886h2.54v-2.2c0-2.506 1.492-3.89 3.772-3.89 1.094 0 2.239.197 2.239.197v2.48h-1.261c-1.243 0-1.631.773-1.631 1.562v1.851h2.773l-.444 2.886h-2.329v6.993c4.781-.75 8.438-4.887 8.438-9.878 0-5.523-4.477-10-10-10z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div class="border-t border-white mt-8 pt-8 text-center">
              <p>&copy; 2024Sureelux Pangkhamhak</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
