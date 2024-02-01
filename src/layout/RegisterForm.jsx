import React from "react";

export default function RegisterForm() {
  return (
    <div className="p-4">
      <div className="text-3xl">Register Form</div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">username</span>
          </div>
          <input
            type="text"
            placeholder="username"
            className="input input-bordered w-full max-w-xs"
          />
          </label>
           <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">password</span>
          </div>
          <input
            type="text"
            placeholder="password"
            className="input input-bordered w-full max-w-xs"
          />
        </label>
    </div>
  );
}
