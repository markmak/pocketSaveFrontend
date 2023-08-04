import React, { useContext } from "react";
import { FaUserPlus } from "react-icons/fa";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { Context } from "../Context/context";
import axios from "axios";
import { baseURL } from "../lookup";

function AuthButtons() {
  const { setShowModal, user, setUser, setCurrentPage } = useContext(Context);

  const signupHandle = () => {
    setShowModal("signup");
  };
  const loginHandle = () => {
    setShowModal("login");
  };
  const logoutHandle = async () => {
    await axios.get(baseURL + "auth/logout", {
      withCredentials: true,
      credentials: "include",
    });
    setUser("");
    setCurrentPage("dashboard");
    setShowModal("");
  };

  return (
    <div className="auth-buttons-container">
      {user ? (
        <div
          id="logout-btn"
          className="auth-btn auth-btn-blue"
          onClick={logoutHandle}
        >
          <BiLogOut className="icons bi-icons" />
          <span>Log Out</span>
        </div>
      ) : (
        <>
          <div
            id="signup-btn"
            className="auth-btn auth-btn-light"
            onClick={signupHandle}
          >
            <FaUserPlus className="icons fa-icons" />
            <span>Sign Up</span>
          </div>
          <div
            id="login-btn"
            className="auth-btn auth-btn-dark"
            onClick={loginHandle}
          >
            <BiLogIn className="icons bi-icons" />
            <span>Log In</span>
          </div>
        </>
      )}
    </div>
  );
}

export default AuthButtons;
