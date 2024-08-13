import { useNavigate } from "react-router-dom";

export default function Succeed() {
  const navigate = useNavigate();

  const hdlHome = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 mt-10">
      <div className="flex flex-col items-center border-gray-300 bg-white shadow-lg rounded-3xl p-8 w-full max-w-7xl h-[83vh]">
        <img
          src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_1280.png"
          alt="Success"
          className="w-48 h-48 mb-16 rounded-full shadow-md"
        />
        <div className="text-center">
          <h1
            className="text-6xl font-bold text-green-600 mb-8 text-shadow-lg"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
          >
            จองโต๊ะสำเร็จ
          </h1>
          <p className="text-2xl text-gray-700 mb-20 font-medium">
            คุณได้ทำการจองโต๊ะอาหารเรียบร้อยแล้ว
          </p>

          <button
          onClick={hdlHome} 
          className="overflow-hidden relative w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer z-10 group">
            หน้าหลัก
            <span className="absolute w-36 h-32 -top-8 -left-2 bg-sky-200 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-right" />
            <span className="absolute w-36 h-32 -top-8 -left-2 bg-sky-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-right" />
            <span className="absolute w-36 h-32 -top-8 -left-2 bg-sky-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-right" />
            <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10">
            ขอบคุณ
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
