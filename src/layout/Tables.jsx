import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../hooks/userAuth";

export default function Tables() {
  const [tables, setTables] = useState(null);
  const [types, setTypes] = useState(null);
  const { user } = userAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getTables = async () => {
      try {
        const response = await axios.get("http://localhost:8889/admin/tables");
        setTables(response.data.tables);
        // console.log(tables)
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    const getTypes = async () => {
      try {
        const response = await axios.get("http://localhost:8889/admin/types");
        setTypes(response.data.types);
        // console.log(types)
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    getTables();
    getTypes();
  }, []);

  const hdlBooking = (id) => {


    user?.user_id ? navigate(`/BookingTable/${id}`) : navigate('/login');
  };


  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <div className="carousel w-full">
          <div id="item1" className="carousel-item w-full">
            <img
              src="https://www.themacho.co/wp-content/uploads/2018/12/2-1.jpg"
              className="w-full"
            />
          </div>
          <div id="item2" className="carousel-item w-full">
            <img
              src="https://www.themacho.co/wp-content/uploads/2018/12/8-1.jpg"
              className="w-full"
            />
          </div>
          <div id="item3" className="carousel-item w-full">
            <img
              src="https://www.themacho.co/wp-content/uploads/2018/12/13-1.jpg"
              className="w-full"
            />
          </div>
          <div id="item4" className="carousel-item w-full">
            <img
              src="https://www.themacho.co/wp-content/uploads/2018/12/11-1.jpg"
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-center w-full py-2 gap-2">
          <a href="#item1" className="btn btn-xs">
            1
          </a>
          <a href="#item2" className="btn btn-xs">
            2
          </a>
          <a href="#item3" className="btn btn-xs">
            3
          </a>
          <a href="#item4" className="btn btn-xs">
            4
          </a>
        </div>
        {/* <p>{tables.table_name}</p> */}
        {/* {console.log(tables)} */}
        <div className="divider divider-info text-3xl font-bold mt-10">
          โต๊ะอาหารทั้งหมด
        </div>
        <div className="max-w-[80rem] mx-auto gap-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center mb-1">
          {tables &&
            tables.map((item) => (
              <div
                key={item.table_id}
                className="card-body items-center text-center"
              >
                <div className="card w-96 h-150 bg-base-100 shadow-xl">
                  <figure className="px-10 pt-10">
                    <img src={item.table_img} alt="" />
                  </figure>
                  <div className="flex flex-col gap-3 mt-3">
                    <h3 className="text-xl font-bold">{item.table_name}</h3>
                    <p className="product-price">
                      ราคา :{" "}
                      <label className="text-red-600 text-xl font-normal ">
                        {item.table_price}
                      </label>{" "}
                      บาท
                    </p>
                        <h3 key={item.type_table.type_id} className="product-category">
                          ประเภท : {item.type_table.type_name}
                        </h3> 

                        <h3 className="">สถานะ : {item.table_status === "FREE" ? "ว่าง" : "ไม่ว่าง"}</h3>

                    <div className="card-actions mx-auto px-20 text-center">
                      <button disabled={item.table_status === "BUSY"} onClick={() => hdlBooking(item.table_id)} className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-8 disabled:opacity-50 disabled:cursor-no-drop shadow-xl">จอง</button>
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
