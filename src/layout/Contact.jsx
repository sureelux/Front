import React, { useEffect, useState } from "react";
import {
  FaPhone,
  FaFacebook,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { IoLocationSharp } from "react-icons/io5";

const ContactUs = () => {
  const images = [
    "https://png.pngtree.com/background/20211215/original/pngtree-gourmet-food-tableware-gray-and-black-creative-banner-picture-image_1495471.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animation, setAnimation] = useState("slideIn");

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimation("slideOut");
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setAnimation("slideIn");
      }, 9000); // Match the duration of the slideOut animation
    }, 16000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="bg-pattern min-h-screen flex flex-col items-center py-10 px-1">
      <div className="overflow-hidden w-full max-w-10xl">
        <div className="relative overflow-hidden w-full mt-10 h-[400px]">
          <img
            src={images[currentImageIndex]}
            className={`w-full h-[400px] object-cover absolute ${animation}`}
          />

          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-7xl font-bold animate-bounce">ติดต่อเรา</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold">ชื่อร้านอาหาร</h2>
            <p className="mt-2 text-gray-600">ร้านอาหารอร่อยที่สุดในเมือง</p>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="text-2xl" />
              <div className="ml-3">
                <p className="font-semibold">ที่อยู่:</p>
                <p>123 ถนนสุขสันต์ ตำบลเมือง อำเภอเมือง จังหวัดกรุงเทพมหานคร</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <FaPhone className="text-2xl" />
              <div className="ml-3">
                <p className="font-semibold">เบอร์โทรศัพท์:</p>
                <p>012-345-6789</p>
              </div>
            </div>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5 ">
              <div className="flex flex-col items-center p-6 bg-gradient-to-tr from-white to-blue-300 border-2 border-black rounded-xl shadow-xl hover:scale-90 transition duration-150 ease-in-out transform hover:shadow-2xl ">
                <FaFacebook className="text-4xl text-blue-700 mb-2 drop-shadow-lg" />
                <h4 className="text-xl font-bold text-gray-800 mb-1">
                  Facebook
                </h4>
                <a
                  href="https://www.facebook.com/profile.php?id=100021929414668&locale=th_TH"
                  className="text-blue-600 hover:text-blue-400 "
                >
                  Sureelux Pangkhamhak
                </a>
              </div>

              <div class="flex flex-col items-center p-4 bg-gradient-to-tr from-white to-red-300 border-2 border-black rounded-lg shadow-md hover:scale-90 transition duration-150 ease-in-out">
                <FaEnvelope className="text-4xl text-red-600 mb-2" />
                <h4 className="text-xl font-bold">อีเมล</h4>
                <a href="" className="text-red-600 hover:text-red-400">
                  sureelux.pa64@snru.ac.th
                </a>
              </div>
              <div class="flex flex-col items-center p-4 bg-gradient-to-tr from-white to-green-300 border-2 border-black rounded-lg shadow-md border  hover:scale-90 transition duration-150 ease-in-out">
                <IoLocationSharp className="text-4xl text-green-500 mb-2" />
                <h4 className="text-xl font-bold">พิกัด</h4>
                <a
                  href="https://www.google.com/maps/place/17%C2%B010'52.2%22N+104%C2%B004'59.9%22E/@17.181159,104.083312,17z/data=!3m1!4b1!4m4!3m3!8m2!3d17.181159!4d104.083312?entry=ttu"
                  className="text-green-500 hover:text-green-400"
                >
                  17.181159, 104.083312
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
