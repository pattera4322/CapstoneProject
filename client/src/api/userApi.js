import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from "./firebase";
import Popup from "../components/Popup.js";
import styled from "@emotion/styled";
// const baseURL = 'http://localhost:5000/api/file';

const baseURL = process.env.REACT_APP_API_URL;

export const useAuthenticate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const signUp = async (email, password) => {
    setError("");
    try {
      const response = await axios.post(`${baseURL}/signup`, {
        email: email,
        password: password,
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Signup successful.",
        showConfirmButton: true,
        confirmButtonText: "Go to login ->",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      console.log("success create user: ", response);
      return response;
    } catch (error) {
      console.log("error sign up: ", error);
      if (error.response) {
        setError(error.response.data.RespMessage);
      } else {
        throw error;
      }
    }
  };

  const logIn = async (email, password) => {
    setError("");
    try {
      setLoading(true);
      if (!email) {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.idToken;
        const token = await auth.currentUser.getIdToken();
        //console.log(token)
        const user = result.user.displayName;
        const userUid = result.user.uid;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem(
            "user",
            JSON.stringify({ userName: user, uid: userUid })
          );
          console.log("Success login and this is user", user);
          await Swal.fire({
            icon: "success",
            title: "You are now sign in!",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/");
          window.location.reload();
        }
        setLoading(false);
        return result;
      } else {
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            const token = user.accessToken;
            localStorage.setItem("token", token);
            localStorage.setItem(
              "user",
              JSON.stringify({ userName: user.email, uid: user.uid })
            );
            console.log("Success login and this is user", user);
            await Swal.fire({
              icon: "success",
              title: "You are now sign in!",
              showConfirmButton: false,
              timer: 1500,
            });
            navigate("/");
            window.location.reload();
            return user;
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === "auth/invalid-credential") {
              setError("Incorrect username or password");
            }
            console.log("Login failed with: ", errorCode, errorMessage);
          });
      }
    } catch (error) {
      // setError(error.message);
      setLoading(false);
    }
  };

  const logOut = async () => {
    signOut(auth)
      .then(async () => {
        await Swal.fire({
          // icon: "warning",
          title: "Wanna leave?",
          confirmButtonColor: "#1E1E1E",
          showCancelButton: true,
          cancelButtonColor: "#DCDBDC",
          confirmButtonText: "Sign out",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await Swal.fire({
              icon: "success",
              title: "You are now sign out!",
              showConfirmButton: false,
              timer: 1500,
            });
            navigate("/");
            localStorage.clear();
            window.location.reload();
            console.log("Sign-out successful.");
          }
        });
      })
      .catch((error) => {
        console.log("Sign-out not success.");
      });
  };

  return {
    signUp,
    logIn,
    loading,
    error,
    logOut,
  };
};
