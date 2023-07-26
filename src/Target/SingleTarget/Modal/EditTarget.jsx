import React, { useContext, useState } from "react";
import { Context } from "../../../Context/context";
import Dropzone from "react-dropzone";
import { MdEditDocument } from "react-icons/md";
import axios from "axios";
import { baseURL } from "../../../lookup";

function EditTarget({ updateTarget }) {
  const { showModal, setShowModal, checkErrorAndLogout } = useContext(Context);
  const {
    _id,
    name,
    amount,
    targetSavingPeriod,
    createdAt,
    completedDate,
    status,
    comment,
  } = showModal.data;
  const [uploadedPhotoName, setUploadedPhotoName] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [error, setError] = useState("");

  const dropHandle = (file) => {
    let name = file[0].name;
    if (name.length > 35) {
      const format = name.split(".").at(-1);
      name = name.substring(0, 30) + `... .${format}`;
    }
    setUploadedPhotoName(name);
    setUploadedPhoto(file[0]);
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    let inputList = [...document.getElementsByClassName("edit-target-data")];
    inputList = inputList.reduce((a, c) => {
      a[c.name] = c.value;
      return a;
    }, {});
    const data = new FormData();
    data.append("json", JSON.stringify(inputList));
    if (uploadedPhoto) {
      data.append("photo", uploadedPhoto);
    }
    try {
      await axios.patch(baseURL + `target/${_id}`, data, {
        withCredentials: true,
      });
      setShowModal("");
      updateTarget();
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };

  return (
    <div className="main-modal edit-target">
      <h2>Edit Target</h2>
      <form onSubmit={submitHandle}>
        <div className="single-input">
          <label htmlFor="edit-target-name">Name: </label>
          <input
            type="text"
            name="name"
            id="edit-target-name"
            className="edit-target-data input-style-bottom"
            minLength="3"
            maxLength="40"
            defaultValue={name}
            required
          />
        </div>
        <div className="single-input">
          <label htmlFor="edit-target-amount">Amount: </label>
          <input
            type="number"
            name="amount"
            id="edit-target-amount"
            className="edit-target-data input-style-bottom"
            min="1"
            defaultValue={amount}
            required
          />
        </div>
        <div className="single-input">
          <label htmlFor="edit-target-targetSavingPeriod">
            Target saving period:
          </label>
          <input
            type="number"
            name="targetSavingPeriod"
            id="edit-target-targetSavingPeriod"
            className="edit-target-data input-style-bottom"
            min="1"
            defaultValue={targetSavingPeriod}
            required
          />
        </div>
        <div className="single-input">
          <label htmlFor="edit-target-createdAt">Created date:</label>
          <input
            type="date"
            name="createdAt"
            id="edit-target-createdAt"
            className="edit-target-data input-style-bottom"
            defaultValue={createdAt}
            max={new Date().toJSON().substring(0, 10)}
            required
          />
        </div>
        {status !== "on going" && (
          <div className="single-input">
            <label htmlFor="edit-target-completedDate">Completed date: </label>
            <input
              type="date"
              name="completedDate"
              id="edit-target-completedDate"
              className="edit-target-data input-style-bottom"
              defaultValue={completedDate}
            />
          </div>
        )}
        <div className="single-input">
          <label htmlFor="edit-target-comment">Comment: </label>
          <textarea
            name="comment"
            id="edit-target-comment"
            className="edit-target-data input-style-bottom"
            defaultValue={comment}
          ></textarea>
        </div>
        <h4>Change photo</h4>
        <Dropzone
          accept={{ "image/png": [".jpeg", ".png", ".jpg"] }}
          maxFiles={1}
          maxSize={30 * 1000 * 1000}
          onDrop={dropHandle}
        >
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone-container" {...getRootProps()}>
              <input className="dropzone-input" {...getInputProps} />
              {uploadedPhotoName ? (
                <p className="dropzone-text">
                  {uploadedPhotoName}
                  <MdEditDocument className="dropzone-icon" />
                </p>
              ) : (
                <p className="dropzone-text">
                  Drag and Drop your photo, or click to select file
                </p>
              )}
            </div>
          )}
        </Dropzone>
        <p className="gray-text">
          Your photo should be in .png, .jpg, or .jpeg format with a file size
          of less than 30MB.
        </p>
        <div className="error-text">{error}</div>
        <div className="btns-container">
          <button type="submit" className="btn green-btn">
            Edit Target
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTarget;
