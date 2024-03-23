import axios from "axios";
import Swal from "sweetalert2";
import {
  showSuccessAlert,
  showErrorAlertWithRefresh,
} from "../utils/SwalAlert.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from "../config/firebase.js";

const baseURL = process.env.REACT_APP_API_URL;

export const useAuthenticate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signUp = async (email, password) => {
    setError("");
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/signup`, {
        email: email,
        password: password,
      });
      setLoading(false);
      Swal.fire({
        icon: "success",
        title: "Register successful!",
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
      setLoading(false);
      console.log("error sign up: ", error);
      if (error.response) {
        setError(error.response.data.ResponseMessage);
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
          await showSuccessAlert("You are now sign in!");
          setLoading(false);
          navigate("/");
          window.location.reload();
        }
        return result;
      } else {
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            const token = await user.getIdToken();
            localStorage.setItem("token", token);
            localStorage.setItem(
              "user",
              JSON.stringify({ userName: user.email, uid: user.uid })
            );
            console.log("Success login and this is user", user);
            await showSuccessAlert("You are now sign in!");
            setLoading(false);
            navigate("/");
            window.location.reload();
            return user;
          })
          .catch((error) => {
            setLoading(false);
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === "auth/invalid-credential") {
              setError("Incorrect username or password");
            } else if (errorCode === "auth/network-request-failed") {
              showErrorAlertWithRefresh("Internet Connection");
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
          title: "Are you sure you want \nto log out?",
          confirmButtonColor: "red",
          showCancelButton: true,
          cancelButtonColor: "#DCDBDC",
          confirmButtonText: "Log out",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await showSuccessAlert("You are now sign out!");
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
