import axios from "axios";
import React, { useContext, useState } from "react";
import { baseURL } from "../../lookup";
import { Context } from "../../Context/context";

function ChangeCurrentTarget({ getTargetList }) {
  const { setShowModal, currentTarget, setCurrentTarget, checkErrorAndLogout } =
    useContext(Context);
  const { _id, savingRecord, amount } = currentTarget;
  const [error, setError] = useState("");
  const changeTargetStatus = async (newStatus) => {
    try {
      await axios.patch(
        baseURL + `target/${_id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setShowModal("addTarget");
      setCurrentTarget("");
      getTargetList();
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };
  return (
    <div className="main-modal change-target">
      <h2>You can only set and work towards one target at a time!</h2>
      <h3>Change current target status:</h3>
      <div className="chooses-container">
        <div className="choose">
          <p>Complete the target by allocated all the required saving now</p>
          <h4>Required saving: </h4>
          <p>{savingRecord.reduce((a, c) => a - c.amount, amount)}</p>
          <button
            type="button"
            className="btn green-btn"
            onClick={() => {
              changeTargetStatus("success");
            }}
          >
            Success
          </button>
        </div>
        <h4>Or</h4>
        <div className="choose">
          <p>Abandon current target</p>
          <button
            type="button"
            className="btn red-btn"
            onClick={() => {
              changeTargetStatus("abandon");
            }}
          >
            Abandon
          </button>
        </div>
        <div className="error-text">{error}</div>
      </div>
    </div>
  );
}

export default ChangeCurrentTarget;
