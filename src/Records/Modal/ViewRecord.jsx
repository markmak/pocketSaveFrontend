import React, { useContext, useState } from "react";
import { Context } from "../../Context/context";
import axios from "axios";
import { baseURL, filterKeys } from "../../lookup";

function ViewRecord({ updateRecords, setRecordPage }) {
  const { showModal, setShowModal, recordsFilter, checkErrorAndLogout } =
    useContext(Context);
  const [error, setError] = useState("");

  const { _id, recordType, type, amount, date } = showModal.data;
  const [week, month, day, year] = new Date(date).toDateString().split(" ");
  const displayDate = `${week} ${day} ${month} ${year}`;
  const removeRecordHandle = async () => {
    try {
      await axios.delete(baseURL + `record/${_id}`, { withCredentials: true });
      setShowModal("");
      setRecordPage(1);
      const queryString = filterKeys.reduce((a, c) => {
        if (recordsFilter[c]) {
          a += `&${c}=${recordsFilter[c]}`;
        }
        return a;
      }, "?page=1");
      updateRecords(queryString);
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };
  const editRecordHandle = () => {
    setShowModal({ type: "newRecord", data: showModal.data });
  };
  return (
    <div className="main-modal view-modal">
      <h2>View record</h2>
      <h4>Record type:</h4>
      <p>{recordType}</p>
      <h4>Type: </h4>
      <p>{type}</p>
      <h4>Date: </h4>
      <p>{displayDate}</p>
      <h4>Amount: </h4>
      <p>{amount}</p>
      <h4>Name: </h4>
      <p>{showModal.data.name || "no name for this record"}</p>
      <h4>Comment: </h4>
      <p className="comment">
        {showModal.data.comment || "no comment for this record"}
      </p>
      <div className="error-text">{error}</div>
      <div className="btns-container">
        <button
          type="button"
          className="btn red-btn"
          onClick={removeRecordHandle}
        >
          Remove record
        </button>
        <button
          type="button"
          className="btn green-btn"
          onClick={editRecordHandle}
        >
          Edit record
        </button>
      </div>
    </div>
  );
}

export default ViewRecord;
