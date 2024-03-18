import {Link, useNavigate} from 'react-router-dom'
import useAuth from '../hooks/userAuth'
import {useEffect, useState} from "react";
import axios from 'axios';


const guestNav = [
    { to : '/' },
  ]
  
  const userNav = [
    { to : '/', text: 'Home' },
    { to : '/', text: 'Home' },
  
  ]


export default function Profile() {
    const {user, logout} = useAuth()
    const finalNav = user?.user_id ? userNav : guestNav

    const navigate = useNavigate()
  
    const hdlUpdateProfile = () => {
      navigate('/updateProfile')
    }

    return (
      <div className="text-center pt-5 h-screen">
       <p className="text-3xl pt-24 font-bold">
        บัญชีของ <label className="text-3xl pt-24 text-red-600">{user?.user_id ? user.username : "Guest"}</label>
      </p>
      <hr className="border-t border-sky-500 my-2  justify-center flex m-36 " />

      {user ? (
  <div className="flex justify-center">
    <div className="m-10 text-2xl">
      <label className="form-control w-full max-w rounded-full">
        <div className="label">
          <span className="label font-bold text-center">ชื่อผู้ใช้ : <p className='font-normal'> {user.username}</p></span>
        </div>
      </label>
      <label className="form-control w-full max-w rounded-full">
        <div className="label">
          <span className="label font-bold">ชื่อ : <p className='font-normal'>{user.firstname}</p></span>
        </div>
      </label>
      <label className="form-control w-full max-w rounded-full">
        <div className="label">
          <span className="label font-bold">นามสกุล : <p className='font-normal'>{user.lastname}</p></span>
        </div>
      </label>
      <label className="form-control w-full max-w rounded-full">
        <div className="label">
          <span className="label font-bold">ที่อยู่ : <p className='font-normal'>{user.address}</p></span>
        </div>
      </label>
      <label className="form-control w-full max-w rounded-full">
        <div className="label">
          <span className="label font-bold">เบอร์โทรศัพท์ : <p className='font-normal'>{user.phone}</p></span>
        </div>
      </label>
      <label className="form-control w-full max-w rounded-full">
        <div className="label">
          <span className="label font-bold">อีเมล : <p className='font-normal'>{user.email}</p></span>
        </div>
      </label>
    </div>
  </div>
) : null}

      <a className="link link-hover mb-12 text-xl text-red-500 font-bold " onClick={hdlUpdateProfile}>
          แก้ไขบัญชี
      </a>
  </div>

    );
    }