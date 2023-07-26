import React, { useContext, useState } from "react";
import Dropzone from "react-dropzone";
import { MdEditDocument } from "react-icons/md";
import { baseURL } from "../../lookup";
import axios from "axios";
import { Context } from "../../Context/context";

function ChangePhoto() {
  const { setShowModal, setUser, checkErrorAndLogout } = useContext(Context);
  const [error, setError] = useState("");
  const [uploadedPhotoName, setUploadedPhotoName] = useState("");
  const [newIcon, setNewIcon] = useState(null);

  const submitHandle = async (e) => {
    e.preventDefault();
    if (!newIcon) {
      return;
    }
    const data = new FormData();
    data.append("icon", newIcon);
    try {
      const updateResponse = await axios.post(baseURL + "setting/icon", data, {
        withCredentials: true,
      });
      setUser((prev) => ({ ...prev, img: updateResponse.data.img }));
      setShowModal("");
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };

  const dropHandle = (file) => {
    let name = file[0].name;
    if (name.length > 35) {
      const format = name.split(".").at(-1);
      name = name.substring(0, 30) + `... .${format}`;
    }
    setUploadedPhotoName(name);
    setNewIcon(file[0]);
  };

  return (
    <form className="setting-modal-form" onSubmit={submitHandle}>
      <h2 className="setting-modal-title">Change photo</h2>

      <Dropzone
        accept={{ "image/png": [".jpeg", ".png", ".jpg"] }}
        maxFiles={1}
        maxSize={30 * 1000 * 1000}
        onDrop={dropHandle}
      >
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone-container" {...getRootProps()}>
            <input
              id="setting-change-photo-input"
              name="icon"
              {...getInputProps()}
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
      <p className="setting-change-photo-text gray-text">
        Your photo should be in .png, .jpg, or .jpeg format with a file size of
        less than 30MB.
      </p>
      <p className="error-text">{error}</p>
      <button className="blue-btn btn" type="submit">
        Change
      </button>
    </form>
  );
}

export default ChangePhoto;
