import React, { useContext } from "react";
import Login from "./Modal/Login";
import Signup from "./Modal/Signup";
import { Context } from "../Context/context";
import { IoClose } from "react-icons/io5";

function AuthModal() {
  const { showModal, setShowModal } = useContext(Context);

  const closeModal = () => {
    setShowModal("");
  };

  return (
    <div className="modal-container">
      <div className="modal-input-part">
        <IoClose className="modal-close-icon" onClick={closeModal} />
        <div className="modal-logo-container">
          <img src="/logo192.png" alt="Pocket Save Logo" id="modal-logo" />
          <span>Pocket Save</span>
        </div>
        <div className="modal-text">
          {showModal === "login"
            ? "Login to Pocket Save"
            : "Create Your Pocket Save Account"}
        </div>
        {showModal === "login" ? <Login /> : <Signup />}
      </div>
      <div className="img-container">
        {showModal === "login" ? (
          <img className="modal-img" src="/loginModalImg.jpg" alt="Log in" />
        ) : (
          <img className="modal-img" src="/signupModalImg.jpg" alt="Sign up" />
        )}
        <div className="img-filter"></div>
      </div>
    </div>
  );
}

export default AuthModal;
