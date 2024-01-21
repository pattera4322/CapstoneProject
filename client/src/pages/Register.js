import React from "react";
import Form from "../components/Form";
import { NavLink } from "react-router-dom";
import { useAuthenticate } from "../api/userApi";

function Register() {
  const { logIn,signUp, loading, error } = useAuthenticate();
  const handleRegister =async (formData) => {
    if(formData.isProvider === true){
      await logIn()
    }else{
      await signUp(formData.email,formData.password)
    }
    
    console.log('Registering with:', formData);
  };
  return (
    <div className="mt-28 items-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-[#F1D1AB]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create an account
            </h1>
            <Form onSubmit={handleRegister} isLogin={false} errorMessage={error} />
            <p className="text-sm font-light text-gray-700">
            Already have an account?{" "}
              <NavLink
                to="/Login"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Login
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
