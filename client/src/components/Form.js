import React, { useState } from "react";
import Alert from "@mui/material/Alert";

const FormComponent = ({ onSubmit, isLogin, errorMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProvider, setisProvider] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateEmptyInput = (input) => {
    return input !== "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    let isValid = true
    if (isProvider == false) {
      if (!validateEmptyInput(email)) {
        setEmailError("Please enter your email address");
        isValid = false
      } else if (!validateEmail(email)) {
        setEmailError("Invalid email address");
        isValid = false
      }

      if (!validateEmptyInput(password)) {
        setPasswordError("Please enter your password");
        isValid = false
      } else if (!validatePassword(password)) {
        setPasswordError("Password must be at least 8 characters");
        isValid = false
      }

      if (!isLogin) {
        if (!validateEmptyInput(confirmPassword)) {
          setConfirmPasswordError("Please enter your confirm password");
          isValid = false
        } else if (password !== confirmPassword) {
          setConfirmPasswordError("Passwords don't match!");
          isValid = false
        }
        
      } 
      if(!isValid){
        return;
      }
    }

    onSubmit({ email, password, isProvider });
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="text-left block mb-2 text-base font-medium text-gray-900 dark:text-white">
          Email:
          <input
            className="bg-[#F6F6F6] text-gray-900 text-base rounded-lg block w-full p-2.5"
            type="text"
            value={email}
            placeholder="name@company.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <div style={{ color: "red" }}>{emailError}</div>}
        </label>
      </div>
      <div>
        <label className="text-left block mb-2 text-base font-medium text-gray-900 dark:text-white">
          Password:
          <input
            className="bg-[#F6F6F6] text-gray-900 text-base rounded-lg block w-full p-2.5"
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <div style={{ color: "red" }}>{passwordError}</div>}
        </label>
      </div>
      {isLogin ? null : (
        <>
          <div>
            <label className="text-left block mb-2 text-base font-medium text-gray-900 dark:text-white">
              Confirm Password:
              <input
                className="bg-[#F6F6F6] text-gray-900 text-base rounded-lg block w-full p-2.5"
                type="password"
                value={confirmPassword}
                placeholder="••••••••"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPasswordError && (
                <div style={{ color: "red" }}>{confirmPasswordError}</div>
              )}
            </label>
          </div>
          <br />
        </>
      )}

      {errorMessage && (
        <div
          style={{ color: "red", fontWeight: "bold", marginBottom: "-15px" }}
        >
          {errorMessage}
        </div>
      )}

      {/* {errorMessage && <Alert severity="error">{errorMessage}</Alert>} */}

      <span className="flex flex-row gap-3">
        <button
          className="w-full text-white bg-[#0068D2] hover:bg-[#3386DB] font-medium rounded-lg text-base px-5 py-2.5 text-center basis-1/4"
          type="submit"
          onClick={() => setisProvider(false)}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        {/* <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 mb-0 text-center font-medium text-gray-900 dark:text-white">
            or
          </p>
        </div> */}

        <button
          className="w-full text-white bg-[#0068D2] hover:bg-[#3386DB] font-medium rounded-lg text-base px-5 py-2.5 basis-3/4"
          type="submit"
          onClick={() => setisProvider(true)}
        >
          <div className="text-center">
            <img
              src={process.env.PUBLIC_URL + "/assets/google.png"}
              alt="google"
              className=" me-3 h-6 w-6"
            />
            Continue with Google
          </div>
        </button>
      </span>
    </form>
  );
};

export default FormComponent;
