import React, { useState } from "react";

const FormComponent = ({ onSubmit, isLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match for registration
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    onSubmit({ username, password });
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Your Email:
          <input
            className="bg-[#F6F6F6] text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
            type="text"
            value={username}
            placeholder="name@company.com"
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Password:
          <input
            className="bg-[#F6F6F6] text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      {isLogin ? null : (
        <>
          <div>
            <label className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Confirm Password:
              <input
                className="bg-[#F6F6F6] text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                type="password"
                value={confirmPassword}
                placeholder="••••••••"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          </div>
          <br />
        </>
      )}
      <button
        className="w-full text-black bg-white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        type="submit"
      >
        {isLogin ? "Login" : "Register"}
      </button>
    </form>
  );
};

export default FormComponent;
