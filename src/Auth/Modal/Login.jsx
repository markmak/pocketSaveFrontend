import React, { useContext, useState } from "react";
import { Context } from "../../Context/context";
import { baseURL } from "../../lookup";
import axios from "axios";

function Login() {
  const { setShowModal, setUser } = useContext(Context);
  const [error, setError] = useState("");

  const submitHandle = async (e) => {
    e.preventDefault();
    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;
    try {
      const user = await axios.post(
        baseURL + "auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setUser(user.data);
      setShowModal("");
    } catch (err) {
      setError(
        err?.response?.data?.errMsg ||
          "Internal server error, please try again later."
      );
    }
  };
  const signupHandle = () => {
    setShowModal("signup");
  };

  return (
    <div className="signup-login-container">
      <form className="signup-login-form" onSubmit={submitHandle}>
        <label htmlFor="login-email">
          <div>Email Address</div>
          <input
            type="email"
            name="email"
            id="login-email"
            className="modal-input input-style-bottom"
            required
          />
        </label>
        <label htmlFor="login-password">
          <div>Password</div>
          <input
            type="password"
            name="password"
            id="login-password"
            className="modal-input input-style-bottom"
            required
          />
        </label>
        <button className="modal-submit-btn btn deep-blue-btn" type="submit">
          Log in
        </button>
      </form>
      <div className="error-text">{error}</div>
      <div className="change-modal-container">
        Don't have an account?{" "}
        <span className="change-modal-btn" onClick={signupHandle}>
          SIGN UP
        </span>
      </div>
    </div>
  );
}

export default Login;
