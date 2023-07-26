import React, { useContext, useState } from "react";
import { Context } from "../../../Context/context";
import axios from "axios";
import { baseURL } from "../../../lookup";

function ChangeStatus({ updateTarget }) {
  const { showModal, setShowModal, checkErrorAndLogout } = useContext(Context);
  const { _id, amount, savingRecord, status } = showModal.data;
  const [error, setError] = useState("");
  const requiredSaving = Math.ceil(
    savingRecord.reduce((a, c) => a - c.amount, amount)
  );
  const editStatus = async (newStatus) => {
    try {
      await axios.patch(
        baseURL + `target/${_id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setShowModal("");
      updateTarget();
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };
  return (
    <div className="main-modal change-status">
      <h2>Change Status</h2>
      <div className="chooses-container">
        {status === "on going" && (
          <>
            <div className="choose">
              {requiredSaving > 0 ? (
                <>
                  <p>
                    Complete the target by allocated all the required saving now
                  </p>
                  <h4>Required saving: </h4>
                  <p>{requiredSaving}</p>
                </>
              ) : (
                <p>
                  Your dedication and commitment have paid off. Congratulations
                  on achieving your savings target!
                </p>
              )}
              <button
                type="button"
                className="btn green-btn"
                onClick={() => {
                  editStatus("success");
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
                  editStatus("abandon");
                }}
              >
                Abandon
              </button>
            </div>
          </>
        )}
        {status !== "on going" && (
          <>
            <div className="choose">
              <p>
                Pick up where you left off and continue making progress towards
                your goal.
              </p>
              <button
                type="button"
                className="btn green-btn"
                onClick={() => {
                  editStatus("on going");
                }}
              >
                Resume target
              </button>
            </div>
            <h4>Or</h4>
          </>
        )}
        {status === "success" && (
          <div className="choose">
            <p>Abandon current target</p>
            <button
              type="button"
              className="btn red-btn"
              onClick={() => {
                editStatus("abandon");
              }}
            >
              Abandon
            </button>
          </div>
        )}
        {status === "abandon" && (
          <div className="choose">
            {requiredSaving > 0 ? (
              <>
                <p>
                  Complete the target by allocated all the required saving now.
                </p>
                <h4>Required saving: </h4>
                <p>{requiredSaving}</p>
              </>
            ) : (
              <p>
                Your dedication and commitment have paid off. Congratulations on
                achieving your savings target!
              </p>
            )}
            <button
              type="button"
              className="btn green-btn"
              onClick={() => {
                editStatus("success");
              }}
            >
              Success
            </button>
          </div>
        )}
        <div className="error-text">{error}</div>
      </div>
    </div>
  );
}

export default ChangeStatus;
