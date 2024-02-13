import axios from "axios";
import React, { useState } from "react";

export default function NewTodoForm() {
  const [input, setInput] = useState({
    title: "",
    duedate: new Date(),
  });

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      // setInput(prv => ({...prv, dueDate : new Date(prv.dueDate)}))
      const output = { ...input, duedate: new Date(input.duedate) };
      const token = localStorage.getItem("token");
      const rs = await axios.post("http://localhost:8889/todos", output, {
        headers: {
          Authorization: `Bearer ${token}`}
      });
      alert('OK')
      console.log(output)
    } catch (err) {
      alert(err.message)
    }
    // console.log(output)
  };

  return (
    <form
      className="flex flex-col min-w-[600px] border rounded w-5/6 mx-auto p-4 gap-6"
      onSubmit={hdlSubmit}
    >
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">todo list</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full"
          name="title"
          value={input.title}
          onChange={hdlChange}
        />
      </label>
      <label className="form-control w-full max-w-[220px]">
        <div className="label">
          <span className="label-text-alt">due date</span>
        </div>
        <input
          type="date"
          name="duedate"
          value={input.value}
          onChange={hdlChange}
        />
      </label>
      <button className="btn btn-outline btn-info">Add new</button>
    </form>
  );
}
