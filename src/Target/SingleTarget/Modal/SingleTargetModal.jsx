import React, { useContext } from "react";
import { Context } from "../../../Context/context";
import { IoClose } from "react-icons/io5";
import AllocateSaving from "./AllocateSaving";
import ChangeStatus from "./ChangeStatus";
import EditTarget from "./EditTarget";
import EditSaving from "./EditSaving";

function SingleTargetModal({ updateTarget }) {
  const { showModal, setShowModal } = useContext(Context);
  const { type } = showModal;

  const closeModal = () => {
    setShowModal("");
  };
  return (
    <div className="modal-container page-modal single-target-modal">
      <IoClose className="modal-close-icon" onClick={closeModal} />
      {type === "addSaving" && <AllocateSaving updateTarget={updateTarget} />}
      {type === "changeStatus" && <ChangeStatus updateTarget={updateTarget} />}
      {type === "editTarget" && <EditTarget updateTarget={updateTarget} />}
      {type === "editSaving" && <EditSaving updateTarget={updateTarget} />}
    </div>
  );
}

export default SingleTargetModal;
