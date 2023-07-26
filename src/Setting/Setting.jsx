import React, { useContext, useState } from "react";
import { Context } from "../Context/context";
import EditUserInfo from "./EditUserInfo";
import { baseURL, imgBaseURL } from "../lookup";
import axios from "axios";
import SettingModal from "./SettingModal";

function Setting() {
  const { showModal, setShowModal, user, setUser, checkErrorAndLogout } =
    useContext(Context);
  const { img, name, email } = user;
  const [showEditUserInfo, setShowEditUserInfo] = useState(false);
  const [error, setError] = useState("");

  const openChangePhotoModal = () => {
    setShowModal("changePhoto");
  };

  const openResetPassword = () => {
    setShowModal("resetPassword");
  };

  const removePhotoHandle = async () => {
    try {
      await axios.delete(baseURL + "setting/icon", { withCredentials: true });
      setUser((prev) => ({ ...prev, img: "" }));
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };

  return (
    <main className="setting-page">
      {["changePhoto", "resetPassword"].includes(showModal) && <SettingModal />}
      <h2>User profile</h2>
      <div className="setting-user-icon page-content-container">
        <img
          src={img ? `${imgBaseURL}${img}` : "/logo512.png"}
          alt="user-icon"
        />
        <div className="change-user-icon-container">
          <div
            className="setting-btn btn orange-btn"
            onClick={openChangePhotoModal}
          >
            Change photo
          </div>
          {img && (
            <div
              className="setting-btn btn red-btn"
              onClick={removePhotoHandle}
            >
              Remove photo
            </div>
          )}
        </div>
        <div className="error-text">{error}</div>
      </div>
      {showEditUserInfo ? (
        <EditUserInfo setShowEditUserInfo={setShowEditUserInfo} />
      ) : (
        <div className="setting-user-info-container page-content-container">
          <h4 className="setting-name">Name</h4>
          <p className="setting-user-name">{name}</p>
          <h4 className="setting-email">Email</h4>
          <p className="setting-user-email">{email}</p>
        </div>
      )}
      <div className="setting-btn-container">
        {!showEditUserInfo && (
          <div
            className="setting-btn btn blue-btn"
            onClick={() => setShowEditUserInfo(true)}
          >
            Edit user information
          </div>
        )}
        <div className="setting-btn btn blue-btn" onClick={openResetPassword}>
          Reset password
        </div>
      </div>
    </main>
  );
}

export default Setting;
