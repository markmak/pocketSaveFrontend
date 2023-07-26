import React, { useContext, useState } from "react";
import { Context } from "../../../Context/context";
import axios from "axios";
import { baseURL } from "../../../lookup";

function AllocateSaving({ updateTarget }) {
  const { showModal, setShowModal, checkErrorAndLogout } = useContext(Context);
  const { _id, amount, targetSavingPeriod, savingRecord } = showModal.data;
  const [error, setError] = useState("");

  const remainingTarget = Math.ceil(
    savingRecord.reduce((a, c) => a - c.amount, amount)
  );
  const getMonthlyAllocatedSaving = () => {
    const today = new Date();
    const month =
      today.getMonth() < 9
        ? `0${today.getMonth() + 1}`
        : (today.getMonth() + 1).toString();
    const year = today.getFullYear().toString();
    let monthlyAllocatedSaving = 0;
    for (let i = 0; i < savingRecord.length; i++) {
      const [compareYear, compareMonth] = savingRecord[i].date.split("-");
      if (compareYear !== year) {
        return monthlyAllocatedSaving;
      }
      if (compareMonth === month) {
        monthlyAllocatedSaving += savingRecord[i].amount;
      } else {
        return monthlyAllocatedSaving;
      }
    }
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        baseURL + `target/${_id}/savingRecord`,
        { amount: document.getElementById("allocate-saving-amount").value },
        { withCredentials: true }
      );
      updateTarget();
      setShowModal("");
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };

  return (
    <div className="main-modal allocate-saving">
      <h2>Allocate Saving</h2>
      <div className="saving-info">
        <h4>Monthly saving target: </h4>
        <p>{Math.ceil(amount / targetSavingPeriod)}</p>
        <h4>Remaining target: </h4>
        <p>{remainingTarget >= 0 ? remainingTarget : 0}</p>
        <h4>Monthly allocated saving: </h4>
        <p>{getMonthlyAllocatedSaving()}</p>
      </div>
      <form onSubmit={submitHandle}>
        <div className="single-input">
          <label htmlFor="allocate-saving-amount">Allocate saving: </label>
          <input
            type="number"
            name="amount"
            id="allocate-saving-amount"
            min="0.01"
            step="0.01"
            max={remainingTarget}
            required
          />
        </div>
        <div className="error-text">{error}</div>
        <div className="btns-container">
          <button type="submit" className="btn blue-btn" onClick={submitHandle}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default AllocateSaving;
