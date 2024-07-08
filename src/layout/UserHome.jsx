import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const images = [
  'https://nocnoc.com/blog/wp-content/uploads/2021/03/01-dining-table-decorate.jpg',
  'https://canteen.techximizer.co.th/img/1507802354312.JPG',
  'https://umeal.app/img/1507803265436.JPG',
  'https://blog.cariber.co/wp-content/uploads/2021/12/setting-table-luxury-restaurant-interior-black-shades-with-lot-vegetation.jpg',
  'https://blog.hungryhub.com/wp-content/uploads/2022/07/S__1343529_13_11zon-768x549.jpg'
];


const UserHome = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [backgroundSize, setBackgroundSize] = useState("cover");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setBackgroundSize("100% auto"); 
      setTimeout(() => setBackgroundSize("cover"), 3000); 
    }, 6000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
          backgroundSize: backgroundSize,
          transition: "background-size 20s ease-in-out", 
        }}
      >
        <div className="hero-overlay bg-opacity-50 flex items-center justify-center h-full text-center text-neutral-content">
          <div className="max-w-md px-6">
            <h1 className="mb-5 text-6xl font-bold text-shadow-lg animate-bounce [text-shadow:2px_1px_6px_var(--tw-shadow-color)] shadow-gray-400 ">ยินดีต้อนรับ</h1>
            <p className="mb-5">
              ระบบการจองโต๊ะอาหารออนไลน์ เพื่อจองที่นั่งล่วงหน้าไม่ต้องไปรอลุ้นหน้าร้านว่าจะมีโต๊ะไหม
            </p>
            <Link
              to="/Tables"
              className="btn btn-neutral-content form-control mt-0 font-medium shadow-xl text-gray-800 hover:bg-gray-200"
            >
              ดูโต๊ะอาหาร
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
