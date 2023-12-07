import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import { NavLink } from "react-router-dom";

function Login() {
  const handleLogin = (formData) => {
    console.log("Logging in with:", formData);
  };

  return (
    <div className="mt-48">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-[#F1D1AB]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <Form onSubmit={handleLogin} isLogin={true} />
            <p className="text-sm font-light text-gray-700">
              Don’t have an account yet?{" "}
              <NavLink
                to="/Register"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Register
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
