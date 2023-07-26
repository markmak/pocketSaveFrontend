import React, { useContext, useState } from "react";
import { Context } from "../../Context/context";
import Dropzone from "react-dropzone";
import { MdEditDocument } from "react-icons/md";
import { baseURL } from "../../lookup";
import axios from "axios";

function AddTarget() {
  const { setShowModal, setCurrentTarget, checkErrorAndLogout } =
    useContext(Context);
  const [savingInfo, setSavingInfo] = useState({
    amount: "",
    targetSavingPeriod: "",
  });
  const [characterCount, setCharacterCount] = useState(0);
  const [uploadedPhotoName, setUploadedPhotoName] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [error, setError] = useState("");

  const submitHandle = async (e) => {
    e.preventDefault();
    let inputList = [...document.getElementsByClassName("new-target-data")];
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
      const addedTarget = await axios.post(baseURL + "target/", data, {
        withCredentials: true,
      });
      setCurrentTarget(addedTarget.data);
      setShowModal("");
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };
  const savingInfoChangeHandle = (e) => {
    const name = e.currentTarget.name;
    const value = Number(e.currentTarget.value);
    setSavingInfo((prev) => ({ ...prev, [name]: value }));
  };
  const textareaCountHandle = (e) => {
    setCharacterCount(e.currentTarget.value.length);
  };
  const dropHandle = (file) => {
    let name = file[0].name;
    if (name.length > 35) {
      const format = name.split(".").at(-1);
      name = name.substring(0, 30) + `... .${format}`;
    }
    setUploadedPhotoName(name);
    setUploadedPhoto(file[0]);
  };

  return (
    <div className="add-target-modal">
      <h2>Set saving target</h2>
      <form onSubmit={submitHandle}>
        <div className="single-input">
          <label htmlFor="new-target-name">Target name: </label>
          <input
            type="text"
            name="name"
            id="new-target-name"
            minLength="3"
            maxLength="40"
            className="new-target-data input-style-bottom"
            required
          />
        </div>
        <div className="single-input">
          <label htmlFor="new-target-amount">Amount: </label>
          <input
            type="number"
            name="amount"
            id="new-target-amount"
            min="1"
            value={savingInfo.amount}
            onChange={savingInfoChangeHandle}
            className="new-target-data input-style-bottom"
            required
          />
        </div>
        <div className="single-input">
          <label htmlFor="new-target-saving-period">
            Saving Period (Months):{" "}
          </label>
          <input
            type="number"
            name="targetSavingPeriod"
            id="new-target-saving-period"
            min="1"
            value={savingInfo.targetSavingPeriod}
            onChange={savingInfoChangeHandle}
            className="new-target-data input-style-bottom"
            required
          />
        </div>
        <h4>Monthly saving target:</h4>
        {savingInfo.amount && savingInfo.targetSavingPeriod ? (
          <p className="saving-target-number">
            {Math.ceil(savingInfo.amount / savingInfo.targetSavingPeriod)}
          </p>
        ) : (
          <p className="saving-target">
            Enter amount and saving period to see the monthly saving target.
          </p>
        )}
        <div className="single-input">
          <label htmlFor="new-target-comment">Comment: </label>
          <textarea
            name="comment"
            id="new-target-comment"
            maxLength="400"
            onChange={textareaCountHandle}
            className="new-target-data input-style-bottom"
          ></textarea>
          <p className="gray-text">count: {characterCount}</p>
          <p className="gray-text">
            Please note that the comment field has a word limit of 400
            characters.
          </p>
        </div>
        <h4>Add a photo</h4>
        <Dropzone
          accept={{ "image/png": [".jpeg", ".png", ".jpg"] }}
          maxFiles={1}
          maxSize={30 * 1000 * 1000}
          onDrop={dropHandle}
        >
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone-container" {...getRootProps()}>
              <input
                className="dropzone-input"
                name="photo"
                {...getInputProps}
              />
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
        <p className="file-limit-text gray-text">
          Your photo should be in .png, .jpg, or .jpeg format with a file size
          of less than 30MB.
        </p>
        <div className="error-text">{error}</div>
        <button className="btn blue-btn" type="submit">
          Set target
        </button>
      </form>
    </div>
  );
}

export default AddTarget;
