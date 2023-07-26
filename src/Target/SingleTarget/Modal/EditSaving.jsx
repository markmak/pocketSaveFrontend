import React, { useContext, useState } from "react";
import { Context } from "../../../Context/context";
import axios from "axios";
import { baseURL } from "../../../lookup";
import { useParams } from "react-router-dom";

function EditSaving({ updateTarget }) {
  const { targetId } = useParams();
  const { showModal, setShowModal, checkErrorAndLogout } = useContext(Context);
  const { _id, date, amount, totalAmount, createdAt } = showModal.data;
  const [error, setError] = useState("");

  const submitHandle = async (e) => {
    e.preventDefault();
    let inputList = [...document.getElementsByClassName("edit-saving-data")];
    inputList = inputList.reduce((a, c) => {
      a[c.name] = c.value;
      return a;
    }, {});
    try {
      await axios.patch(
        baseURL + `target/${targetId}/savingRecord/${_id}`,
        inputList,
        { withCredentials: true }
      );
      setShowModal("");
      updateTarget();
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };
  const removeHandle = async () => {
    try {
      await axios.delete(baseURL + `target/${targetId}/savingRecord/${_id}`, {
        withCredentials: true,
      });
      setShowModal("");
      updateTarget();
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };
  return (
    <div className="main-modal edit-saving">
      <h2>Edit Saving Record</h2>
      <form onSubmit={submitHandle}>
        <div className="single-input">
          <label htmlFor="edit-saving-date">Date:</label>
          <input
            type="date"
            name="date"
            id="edit-saving-date"
            className="edit-saving-data input-style-bottom"
            defaultValue={date}
            min={createdAt}
            max={new Date().toJSON().substring(0, 10)}
            required
          />
        </div>
        <div className="single-input">
          <label htmlFor="edit-saving-amount">Amount:</label>
          <input
            type="number"
            name="amount"
            id="edit-saving-amount"
            className="edit-saving-data input-style-bottom"
            defaultValue={amount}
            min="0.01"
            step="0.01"
            max={totalAmount}
            required
          />
        </div>
        <div className="error-text">{error}</div>
        <div className="btns-container">
          <button type="submit" className="btn green-btn">
            Edit Record
          </button>
          <button type="button" onClick={removeHandle} className="btn red-btn">
            Remove Record
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSaving;
