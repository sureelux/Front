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
  const { user } = userAuth();
  const navigate = useNavigate();

  const imageArr = [
    {
      src: "https://sabuyjaishop.com/shop/wallbkk/images/zvvkhk20wyxtple30kjx1782021223017902.jpg",
      alt: "image-01",
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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animation, setAnimation] = useState("slideIn");

  useEffect(() => {
    const getTables = async () => {
      try {
        const response = await axios.get("http://localhost:8889/admin/tables");
        setTables(response.data.tables);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    const getTypes = async () => {
      try {
        const response = await axios.get("http://localhost:8889/admin/types");
        setTypes(response.data.types);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    getTables();
    getTypes();
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
              pagination: true,
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
        <div className="flex items-center justify-center text-4xl font-bold shadow-xl bg-gradient-to-r from-blue-600 via-teal-400 to-green-400 text-white p-8 text-center border border-gray-300 w-full h-[80px]">
          <div className="animate-pulse [text-shadow:2px_1px_6px_var(--tw-shadow-color)] shadow-gray-700 ">โต๊ะอาหารทั้งหมด</div>
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
                  <div className="flex flex-col gap-4 mt-3">
                    <h3 className="text-xl font-bold">{item.table_name}</h3>
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
      </div>
    </div>
  );
}
