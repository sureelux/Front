import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getTables = async () => {
      try {
        const response = await axios.get("http://localhost:8889/admin/tables");
        setTables(response.data.tables);
        // console.log(response.data)
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    // const getTypes = async () => {
    //   try {
    //     // const token = localStorage.getItem("token");
    //     const response = await axios.get("http://localhost:8889/auth/types");
    //     setTypes(response.data);
    //     console.log(response.data)
    //   } catch (error) {
    //     console.error("Error fetching types:", error);
    //   }
    // };

    getTables();
    // getTypes();
  }, []);



  return (
    <div className="h-screen">
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">

        <div className="divider divider-info text-3xl font-bold mt-28 ">โต๊ะธรรมดา</div>
        {/* <div className="max-w-[80rem] mx-auto gap-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center mb-1">
          {tables.map((item) => (
            <div key={item.table_id} className="card-body items-center text-center">
              <div className="card w-96 h-150 bg-base-100 shadow-xl">
                <figure className="px-10 pt-10">
                  <img src={item.table_img} alt="" />
                </figure>
                <div className="flex flex-col gap-3 mt-3">
                <h3 className="text-xl font-bold">{item.table_name}</h3>
                <p className="product-price">ราคา : <label class="text-red-600 text-xl font-normal">{item.table_price}</label> บาท</p>
                <h3 className="product-category">ประเภท : {item.type_id}</h3>
                <div className="card-actions mx-auto px-20 text-center w-full" >
                <p onClick={ () => hdlBooking(item.table_id) } className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mb-8">จอง</p>
                </div>
              </div>
            </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
    </div>
  );
}
