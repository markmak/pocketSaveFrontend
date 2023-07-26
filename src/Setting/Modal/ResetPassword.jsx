import axios from "axios";
import React, { useContext, useState } from "react";
import { baseURL } from "../../lookup";
import { Context } from "../../Context/context";

function ResetPassword() {
  const { setShowModal, checkErrorAndLogout } = useContext(Context);
  const [error, setError] = useState("");

  const submitHandle = async (e) => {
    e.preventDefault();
    let inputList = [...document.getElementsByClassName("modal-input")];
    inputList = inputList.reduce((a, c) => {
      a[c.name] = c.value;
      return a;
    }, {});
    if (inputList.password !== inputList["confirm-password"]) {
      return setError("Password and confirmation password do not match.");
    } else {
      delete inputList["confirm-password"];
    }
    try {
      await axios.patch(baseURL + "setting/password", inputList, {
        withCredentials: true,
      });
      setShowModal("");
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };

  return (
    <form className="setting-modal-form" onSubmit={submitHandle}>
      <h2 className="setting-modal-title">Reset password</h2>
      <label htmlFor="reset-old-password">
        <div>Old Password</div>
        <input
          type="password"
          name="oldPassword"
          id="reset-old-password"
          className="modal-input"
          required
        />
      </label>
      <label htmlFor="reset-new-password">
        <div>New Password</div>
        <input
          type="password"
          name="password"
          id="reset-new-password"
          className="modal-input"
          required
        />
      </label>
      <label htmlFor="confirm-new-password">
        <div>Confirm New Password</div>
        <input
          type="password"
          name="confirm-password"
          id="confirm-new-password"
          className="modal-input"
          required
        />
      </label>
      <p className="error-text">{error}</p>
      <button type="submit" className="btn blue-btn">
        Reset
      </button>
    </form>
  );
}

export default ResetPassword;
