import { useNavigate } from "react-router-dom";

export default function Succeed() {
  const navigate = useNavigate();

  const hdlHome = () => {
    navigate("/Tables");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 mt-16">
      <div className="flex flex-col items-center border-gray-300 bg-white shadow-lg rounded-3xl p-8 w-full max-w-7xl h-[83vh]">
        <img
          src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_1280.png"
          alt="Success"
          className="w-48 h-48 mb-16 rounded-full shadow-md"
        />
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-600 mb-8">
            จองโต๊ะสำเร็จ
          </h1>
          <p className="text-2xl text-gray-700 mb-10 font-medium">
            คุณได้ทำการจองโต๊ะอาหารเรียบร้อยแล้ว
          </p>
          <button
            onClick={hdlHome}
            className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-200 font-medium rounded-lg text-sm px-6 py-3 transition duration-300 ease-in-out shadow-lg"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
}
