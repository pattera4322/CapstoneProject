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
    // Password should be at least 8 characters
    return password.length >= 8;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (confirmPassword === "") {
      return false; // Confirm password is empty
    }
    return password === confirmPassword;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (isProvider == false) {
  //     // Validate email
  //     if (!validateEmail(email)) {
  //       alert("Invalid email address");
  //       return;
  //     }

  //     // Validate password
  //     if (!validatePassword(password)) {
  //       alert("Password must be at least 8 characters");
  //       return;
  //     }

  //     // Check if passwords match for registration
  //     if (!isLogin && password !== confirmPassword) {
  //       alert("Passwords don't match!");
  //       return;
  //     }
  //   }
  //   onSubmit({ email, password, isProvider });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (isProvider === false) {
      // Validate email
      if (!email.trim()) {
        setEmailError("Please fill email");
      } else if (!validateEmail(email)) {
        setEmailError("Invalid email address");
      }

      // Validate password
      if (!isLogin && !password.trim()) {
        setPasswordError("Please fill password");
      } else if (!validatePassword(password)) {
        setPasswordError("Password must be at least 8 characters");
      }

      // Check if passwords match for registration
      if (!validateConfirmPassword(password, confirmPassword)) {
        if (confirmPassword === "") {
          setConfirmPasswordError("Please fill confirm password");
        } else {
          setConfirmPasswordError("Passwords don't match!");
        }
        return;
      }

      if (emailError || passwordError || confirmPasswordError) {
        return;
      }
    }

    onSubmit({ email, password, isProvider });
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Your Email:
          <input
            className="bg-[#F6F6F6] text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
            type="text"
            value={email}
            placeholder="name@company.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <div style={{ color: "red" }}>{emailError}</div>}
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
          {passwordError && <div style={{ color: "red" }}>{passwordError}</div>}
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
              {confirmPasswordError && <div style={{ color: "red" }}>{confirmPasswordError}</div>}
            </label>
          </div>
          <br />
        </>
      )}

      {errorMessage && (
        <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '-15px' }}>{errorMessage}</div>
      )}

      {/* {errorMessage && <Alert severity="error">{errorMessage}</Alert>} */}

      <button
        className="w-full text-black bg-white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        type="submit"
        onClick={() => setisProvider(false)}
      >
        {isLogin ? "Login" : "Register"}
      </button>

      <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
        <p className="mx-4 mb-0 text-center font-medium text-gray-900 dark:text-white">Or</p>
      </div>

      <button
        className="w-full text-black bg-white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5"
        type="submit"
        onClick={() => setisProvider(true)}
      >
        <div className="text-center">
          <img
            src={process.env.PUBLIC_URL + "/assets/google.png"}
            alt="google"
            className=" me-3 h-6 w-6"
          />
          {isLogin ? "Continue" : "Continue"} with Google
        </div>
      </button>
    </form>
  );
};

export default FormComponent;
