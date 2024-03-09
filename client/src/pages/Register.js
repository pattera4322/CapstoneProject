import React from "react";
import Form from "../components/Form";
import { NavLink } from "react-router-dom";
import { useAuthenticate } from "../api/authenApi";
import {showNetworkErrorAlert,showLoadingAlert} from "../utils/SwalAlert";
import Swal from "sweetalert2";

function Register() {
  const { logIn, signUp, loading, error } = useAuthenticate();
  const handleRegister = async (formData) => {
    if (formData.isProvider === true) {
      await logIn();
    } else {
      Swal.showLoading();
      await signUp(formData.email, formData.password).catch((error) => {
        if (error.message === "Network Error") {
          showNetworkErrorAlert();
        }
      });
      
    }

    //console.log("Registering with:", formData);
  };
  return (
    <div className="pt-32 grid grid-cols-2 gap-4 content-center">
      <div className="flex flex-col items-center px-6 py-8 lg:py-0 text-left col-span-1">
          <div className="p-2 space-y-4 md:space-y-6 sm:p-8 w-full">
            <h1 className="text-6xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl dark:text-white">
              Create an account
            </h1>
            <Form
              onSubmit={handleRegister}
              isLogin={false}
              errorMessage={error}
            />
            <p className="text-sm font-light text-[#0068D2]">
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

      <div className={`grid grid-cols-subgrid col-span-1 transition-transform translate-x-0 duration-1000`}>
            <img
              src={process.env.PUBLIC_URL + "/assets/SmartStockLogIn.svg"}
              alt="SmartStock Log in"
              className="mx-auto w-7/12 max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
            />
      </div>
    </div>
  );
}

export default Register;
