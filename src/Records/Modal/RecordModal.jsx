import React, { useContext } from "react";
import { Context } from "../../Context/context";
import { IoClose } from "react-icons/io5";
import NewRecord from "./NewRecord";
import ViewRecord from "./ViewRecord";

function RecordModal({ updateTemplates, updateRecords, setRecordPage }) {
  const { showModal, setShowModal } = useContext(Context);

  const closeModal = () => {
    setShowModal("");
  };

  return (
    <div className="modal-container page-modal record-modal">
      <IoClose className="modal-close-icon" onClick={closeModal} />
      {showModal.type === "newRecord" ? (
        <NewRecord
          updateTemplates={updateTemplates}
          updateRecords={updateRecords}
          setRecordPage={setRecordPage}
        />
      ) : (
        <ViewRecord
          updateRecords={updateRecords}
          setRecordPage={setRecordPage}
        />
      )}
    </div>
  );
}

export default RecordModal;
