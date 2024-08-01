import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../hooks/userAuth";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/core";

export default function Tables() {
  const [tables, setTables] = useState(null);
  const [types, setTypes] = useState(null);
  const [tablesUser, setTablesUser] = useState(null);
  const { user } = userAuth(); 
  const navigate = useNavigate();

  const imageArr = [
    {
      src: "https://sabuyjaishop.com/shop/wallbkk/images/zvvkhk20wyxtple30kjx1782021223017902.jpg",

    },
    {
      src: "https://www.bloggang.com/data/t/tathaitravel/picture/1659527277.jpg",
      alt: "image-02",
    },
    {
      src: "https://www.bloggang.com/data/t/tathaitravel/picture/1659527299.jpg",
      alt: "image-03",
    },
    {
      src: "https://www.bloggang.com/data/t/tathaitravel/picture/1659527244.jpg",
      alt: "image-04",
    },
    {
      src: "https://www.ryoiireview.com/upload/article/201912/1575460965_f7e90e57514ef13099ad72d91271cfc5.jpg",
      alt: "image-05",
    },
    {
      src: "https://nocnoc.com/blog/wp-content/uploads/2020/12/shape-table.jpg",
      alt: "image-06",
    },
    {
      src: "https://nocnoc.com/blog/wp-content/uploads/2023/01/10_how-to-start-a-restaurant-business.jpg",
      alt: "image-07",
    },
    {
      src: "https://nocnoc.com/blog/wp-content/uploads/2023/01/07_how-to-start-a-restaurant-business.jpg",
      alt: "image-08",
    },
  ];
const token = localStorage.getItem("token")
console.log(token)
 
    useEffect(() => {
      const getTables = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:8889/user/tables", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          setTables(response.data.tables);
        } catch (error) {
          console.error("Error fetching tables:", error);
        }
      };
  
      const getTypes = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:8889/admin/types", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          setTypes(response.data.types);
        } catch (error) {
          console.error("Error fetching types:", error);
        }
      };
  
      const getTypesUser = async () => {
        try {
          const response = await axios.get("http://localhost:8889/get");
          setTables(response.data.tables);
        } catch (error) {
          console.error("Error fetching types:", error);
        }
      };
      if(token !== null)
        {
      getTables();
      getTypes();
        }
        else{
          getTypesUser();

        }
    }, []);
  
 
  

  const hdlBooking = (id) => {
    user?.user_id ? navigate(`/BookingTable/${id}`) : navigate("/login");
  };

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
            {imageArr.map((el, index) => (
              <SplideSlide key={index}>
                <div className="h-[280px]">
                  <img className="" src={el.src} alt={el.alt} />
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>
        <div className="flex items-center justify-center text-4xl font-bold shadow-xl bg-gradient-to-r from-blue-600 via-teal-400 to-green-400 text-white p-8 text-center w-full h-[80px]">
          <div className="animate-pulse [text-shadow:2px_1px_6px_var(--tw-shadow-color)] shadow-gray-700">โต๊ะอาหารทั้งหมด</div>
        </div>

        <div className="relative my-2 w-[1450px] mt-8">
          <hr className="absolute top-0 left-0 w-full h-1 rounded-full animate-pulse bg-gradient-to-r from-gray-300 to-gray-600" />
          <div className="absolute top-0 left-0 w-full h-full rounded-full  border-transparent animated-gradient"></div>
        </div>

        <div className="max-w-[100rem] mx-auto gap-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
          {tables &&
            tables.map((item) => (
              <div
                key={item.table_id}
                className="card-body items-center text-center"
              >
                <div className="card w-80 border-2 border-gray-500 shadow-2xl bg-white bg-[url('path-to-your-pattern.png')] bg-contain bg-no-repeat">
                  <figure className="px-10 pt-10 hover:scale-110 transition duration-300 ease-in-out">
                    <img src={item.table_img} alt="" />
                  </figure>
                  <div className="flex flex-col gap-4 mt-2">
                    <h3 className="text-3xl font-bold">{item.table_name}</h3>
                    <p className="product-price font-bold text-2xl">
                      ราคา :{" "}
                      <label className="text-red-600 text-xl font-bold ">
                        {item.table_price}
                      </label>{" "}
                      บาท
                    </p>
                    <h3
                      key={item.type_table.type_id}
                      className="product-category font-bold"
                    >
                      ประเภท :{" "}
                      <label className="text-base font-normal ">
                        {item.type_table.type_name}
                      </label>
                    </h3>

                    <h3 className="font-bold">
                      สถานะ :{" "}
                      <label
                        className={`text-base font-normal ${
                          item.table_status === "FREE"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.table_status === "FREE" ? "ว่าง" : "ไม่ว่าง"}
                      </label>
                    </h3>

                    <div className="card-actions mx-auto px-20 text-center">
                      <button
                        disabled={item.table_status === "BUSY"}
                        onClick={() => hdlBooking(item.table_id)}
                        className="text-white bg-gradient-to-r fbg-gradient-to-r from-blue-500 to-blue-400 hover:bg-gradient-to-l focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-8 disabled:opacity-50 disabled:cursor-no-drop shadow-xl"
                      >
                        จอง
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        
        <footer class="bg-gradient-to-tl bg-sky-600 from-orange-100 via-cyan-400 text-white py-8 w-full">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">ชื่อร้าน</h3>
            <p>จองโต๊ะอาหารออนไลน์ที่ง่ายและสะดวก</p>
          </div>
    
          <div>
            <h3 class="text-xl font-semibold mb-4">ลิงก์ด่วน</h3>
            <ul>
              <li><a href="/UserHome" class="hover:underline">หน้าแรก</a></li>
              <li><a href="/tables" class="hover:underline">เลือกดูโต๊ะอาหาร</a></li>
              <li><a href="/contact" class="hover:underline">ติดต่อเรา</a></li>
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
              <a href="https://www.linkedin.com/in/sureelux-pangkhamhak-7b68962a1/" class="text-white hover:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.736 0-1.325.589-1.325 1.325v21.351c0 .735.589 1.324 1.325 1.324h21.351c.736 0 1.324-.589 1.324-1.324v-21.351c0-.736-.588-1.325-1.324-1.325zm-13.75 20.25h-3.5v-11h3.5v11zm-1.75-12.5c-1.138 0-2.063-.924-2.063-2.062s.925-2.062 2.063-2.062c1.138 0 2.063.924 2.063 2.062s-.925 2.062-2.063 2.062zm13.75 12.5h-3.5v-5.847c0-1.395-.025-3.189-1.945-3.189-1.946 0-2.244 1.521-2.244 3.089v5.947h-3.5v-11h3.356v1.507h.049c.467-.882 1.607-1.811 3.307-1.811 3.54 0 4.191 2.33 4.191 5.359v6.945z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=100021929414668&locale=th_TH" class="text-white hover:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c-5.523 0-10 4.477-10 10 0 4.991 3.657 9.128 8.438 9.878v-6.993h-2.54v-2.886h2.54v-2.2c0-2.506 1.492-3.89 3.772-3.89 1.094 0 2.239.197 2.239.197v2.48h-1.261c-1.243 0-1.631.773-1.631 1.562v1.851h2.773l-.444 2.886h-2.329v6.993c4.781-.75 8.438-4.887 8.438-9.878 0-5.523-4.477-10-10-10z"/>
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

