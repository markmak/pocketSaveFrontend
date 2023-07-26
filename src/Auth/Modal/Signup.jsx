import React, { useContext, useState } from "react";
import { Context } from "../../Context/context";
import axios from "axios";
import { baseURL } from "../../lookup";

function Signup() {
  const { setShowModal, setUser } = useContext(Context);
  const [error, setError] = useState("");

  const submitHandle = async (e) => {
    e.preventDefault();
    let inputList = [...document.getElementsByClassName("modal-input")];
    inputList = inputList.reduce((a, c) => {
      a[c.name] = c.value;
      return a;
    }, {});
    if (inputList.password !== inputList.confirmPassword) {
      return setError("Password doesn't match.");
    } else {
      delete inputList.confirmPassword;
    }
    try {
      const user = await axios.post(baseURL + "auth/register", inputList, {
        withCredentials: true,
      });
      setUser(user.data);
      setShowModal("");
    } catch (err) {
      setError(
        err?.response?.data?.errMsg ||
          "Internal server error, please try again later."
      );
    }
  };

  const loginHandle = () => {
    setShowModal("login");
  };

  return (
    <div className="signup-login-container">
      <form className="signup-login-form" onSubmit={submitHandle}>
        <label htmlFor="signup-name">
          <div>Name</div>
          <input
            type="name"
            name="name"
            id="signup-name"
            className="modal-input input-style-bottom"
            min={3}
            max={30}
            required
          />
        </label>
        <label htmlFor="signup-email">
          <div>Email Address</div>
          <input
            type="email"
            name="email"
            id="signup-email"
            className="modal-input input-style-bottom"
            required
          />
        </label>
        <label htmlFor="signup-password">
          <div>Password</div>
          <input
            type="password"
            name="password"
            min={8}
            id="signup-password"
            className="modal-input input-style-bottom"
            required
          />
        </label>
        <label htmlFor="confirm-password">
          <div>Confirm Password</div>
          <input
            type="password"
            name="confirmPassword"
            min={8}
            id="confirm-password"
            className="modal-input input-style-bottom"
            required
          />
        </label>
        <button className="modal-submit-btn btn deep-blue-btn" type="submit">
          Sign Up
        </button>
      </form>
      <div className="error-text">{error}</div>
      <div className="change-modal-container">
        Already have an account?{" "}
        <span className="change-modal-btn" onClick={loginHandle}>
          LOG IN
        </span>
      </div>
    </div>
  );
}

export default Signup;
