import React, { useContext, useState } from "react";
import { Context } from "../Context/context";
import axios from "axios";
import { baseURL } from "../lookup";

function EditUserInfo({ setShowEditUserInfo }) {
  const { user, setUser, checkErrorAndLogout } = useContext(Context);
  const { name, email } = user;
  const [error, setError] = useState("");

  const submitHandle = async (e) => {
    e.preventDefault();
    let inputList = [...document.getElementsByClassName("change-user-info")];
    inputList = inputList.reduce((a, c) => {
      a[c.name] = c.value;
      return a;
    }, {});
    try {
      const response = await axios.patch(
        baseURL + "setting/userInfo",
        inputList,
        { withCredentials: true }
      );
      setUser((prev) => ({ ...prev, ...response.data }));
      setShowEditUserInfo(false);
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };

  const cancelEdit = () => {
    setShowEditUserInfo(false);
  };

  return (
    <form
      className="setting-user-info-container page-content-container"
      onSubmit={submitHandle}
    >
      <label htmlFor="edit-name">
        <h4 className="setting-name">Name</h4>
      </label>
      <input
        className="setting-user-name input-style-bottom change-user-info"
        defaultValue={name}
        name="name"
        id="edit-name"
        required
      />
      <label htmlFor="edit-email">
        <h4 className="setting-email">Email</h4>
      </label>
      <input
        className="setting-user-email input-style-bottom change-user-info"
        name="email"
        id="edit-email"
        defaultValue={email}
        required
      />
      <p className="error-text">{error}</p>
      <button className="edit-info-btn btn orange-btn" type="submit">
        Edit
      </button>
      <button className="edit-info-btn btn blue-btn" onClick={cancelEdit}>
        Cancel
      </button>
    </form>
  );
}

export default EditUserInfo;
