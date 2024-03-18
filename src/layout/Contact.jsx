import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Contact() {
  const [todos, setTodos] = useState([]);
  function FormatDate(dateString) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options);
  }

  useEffect(() => {
    const run = async () => {
      let token = localStorage.getItem("token");
      const rs = await axios.get("http://localhost:8889/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(rs.data.todos);
    };
    run();
  }, []);

  return (
    <div className="">
      <div className="carousel h-96 mt-20">
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="https://i0.wp.com/www.xn--o3cdbr1ab9cle2ccb9c8gta3ivab.com/wp-content/uploads/2020/08/pic01.jpg?ssl=1"
            className="w-full"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="https://nocnoc.com/blog/wp-content/uploads/2021/03/01-dining-table-decorate.jpg"
            className="w-full"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide3" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide3" className="carousel-item relative w-full">
          <img
            src="https://nocnoc.com/blog/wp-content/uploads/2021/03/22-dining-table-decorate.jpg"
            className="w-full"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide4" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide4" className="carousel-item relative w-full">
          <img
            src="https://nocnoc.com/blog/wp-content/uploads/2021/03/12-dining-table-decorate.jpg"
            className="w-full"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide3" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div>
      <div className="text-center">
        <div className="divider divider-info text-4xl mt-10 font-bold">
          ติดต่อเรา
        </div>
        <div className="text-center mt-8">
          <div className="flex flex-col gap-4 text-xl">
            <h2>
              <i className="fas fa-home"></i> <span class="icon-text "></span>{" "}
              ที่อยู่ :{" "}
              <a className="text-blue-500">
                282 หมู่ที่ 6 ตำบลมหาชัย อำเภอปลาปาก จังหวัดนครพนม 48160
              </a>
              <div className="flex items-center justify-center">
        <iframe
        className="w-96 h-80 rounded-md mt-5"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1905.8930579253683!2d104.08170830458404!3d17.180612454657165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313c92b0ac74d757%3A0x90387d77c9a95781!2z4Lir4Lit4Lie4Lix4LiB4Lia4LmJ4Liy4LiZ4Lin4Lij4LiK4Lix4Lii!5e0!3m2!1sth!2sth!4v1710578010646!5m2!1sth!2sth"
          referrerPolicy="no-referrer-when-downgrade"
        >
        </iframe>
      </div>
            </h2>
            <h2>
              <i className="fas fa-phone"></i> <span class="icon-text"></span>
              โทรศัพท์ : <a className="text-blue-500">065-5390921</a>
            </h2>
            <h2>
              <i className="fas fa-envelope"></i>{" "}
              <span class="icon-text"></span>อีเมล :{" "}
              <a className="text-blue-500">sureelux.pa64@snru.ac.th</a>
            </h2>
            <h2>
              <i className="fab fa-facebook"></i>{" "}
              <span class="icon-text"></span>Facebook :{" "}
              <a
                href="https://www.facebook.com/profile.php?id=100021929414668"
                className="text-blue-500"
              >
                Sureelux Pangkhamhak
              </a>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
