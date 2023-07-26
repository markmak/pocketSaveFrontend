import React, { useContext } from "react";
import { Context } from "../../Context/context";
import { IoClose } from "react-icons/io5";
import ChangeCurrentTarget from "./ChangeCurrentTarget";
import AddTarget from "./AddTarget";

function NewTargetModal({ getTargetList }) {
  const { currentTarget, setShowModal } = useContext(Context);

  const closeModal = () => {
    setShowModal("");
  };
  return (
    <div className="modal-container page-modal target-modal">
      <IoClose className="modal-close-icon" onClick={closeModal} />
      {currentTarget ? (
        <ChangeCurrentTarget getTargetList={getTargetList} />
      ) : (
        <AddTarget />
      )}
    </div>
  );
}

export default NewTargetModal;
