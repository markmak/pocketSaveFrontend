import React, { useContext } from "react";
import { Context } from "../Context/context";
import { IoClose } from "react-icons/io5";
import ChangePhoto from "./Modal/ChangePhoto";
import ResetPassword from "./Modal/ResetPassword";

function SettingModal() {
  const { showModal, setShowModal } = useContext(Context);

  const closeModal = () => {
    setShowModal("");
  };

  return (
    <div className="modal-container page-modal setting-modal">
      <IoClose className="modal-close-icon" onClick={closeModal} />
      <div className="modal-logo-container">
        <img src="/logo192.png" alt="Pocket Save Logo" id="modal-logo" />
        <span>Pocket Save</span>
      </div>
      {showModal === "changePhoto" ? <ChangePhoto /> : <ResetPassword />}
    </div>
  );
}

export default SettingModal;
