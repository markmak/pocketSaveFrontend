import React, { useContext, useState } from "react";
import { Context } from "../../Context/context";
import {
  incomeTypes,
  expenseTypes,
  templateRequireList,
  recordRequireList,
  baseURL,
  filterKeys,
} from "../../lookup";
import axios from "axios";

function NewRecord({ updateTemplates, updateRecords, setRecordPage }) {
  const { showModal, setShowModal, recordsFilter, checkErrorAndLogout } =
    useContext(Context);
  const { data } = showModal;
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [editTemplate, setEditTemplate] = useState(false);
  const [error, setError] = useState("");

  const [selectedRecordType, setSelectedRecordType] = useState(
    data.recordType || ""
  );
  const [characterCount, setCharacterCount] = useState(
    data?.comment?.length || 0
  );

  const moveToEditTemplate = () => {
    setEditTemplate(true);
    setSaveAsTemplate(true);
  };

  const getInputList = () => {
    let inputList = [...document.getElementsByClassName("new-record-data")];
    inputList = inputList.reduce((a, c) => {
      a[c.name] = c.value;
      return a;
    }, {});
    return inputList;
  };
  const checkInputError = (requireList, inputList) => {
    let requireError = "";
    requireList.forEach((requireInput) => {
      if (!inputList[requireInput]) {
        requireError = `Plase provide a ${requireInput}`;
      }
    });
    if (requireError) {
      setError(requireError);
    }
  };
  const createQueryString = () => {
    return filterKeys.reduce((a, c) => {
      if (recordsFilter[c]) {
        a += `&${c}=${recordsFilter[c]}`;
      }
      return a;
    }, "?page=1");
  };

  const addTemplateHandle = async () => {
    const inputList = getInputList();
    inputList.templateName = document.getElementById(
      "new-record-templateName"
    ).value;
    checkInputError(templateRequireList, inputList);
    try {
      await axios.post(baseURL + "record/template", inputList, {
        withCredentials: true,
      });
      setShowModal("");
      updateTemplates();
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };

  const addNewRecordHandle = async (e) => {
    e.preventDefault();
    const inputList = getInputList();
    try {
      await axios.post(baseURL + "record/", inputList, {
        withCredentials: true,
      });
      setShowModal("");
      setRecordPage(1);
      const queryString = createQueryString();
      updateRecords(queryString);
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };
  const editTemplateHandle = async () => {
    const inputList = getInputList();
    inputList.templateName = document.getElementById(
      "new-record-templateName"
    ).value;
    checkInputError(templateRequireList, inputList);
    try {
      await axios.put(baseURL + `record/template/${data._id}`, inputList, {
        withCredentials: true,
      });
      setShowModal("");
      updateTemplates();
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };
  const editRecordHandle = async () => {
    const inputList = getInputList();
    checkInputError(recordRequireList, inputList);
    try {
      await axios.put(baseURL + `record/${data._id}`, inputList, {
        withCredentials: true,
      });
      setShowModal("");
      setRecordPage(1);
      const queryString = createQueryString();
      updateRecords(queryString);
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };
  const removeTemplateHandle = async () => {
    try {
      await axios.delete(baseURL + `record/template/${data._id}`, {
        withCredentials: true,
      });
      updateTemplates();
      setShowModal("");
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };

  const recordTypeHandle = (e) => {
    setSelectedRecordType(e.currentTarget.value);
  };
  const textareaCountHandle = (e) => {
    setCharacterCount(e.currentTarget.value.length);
  };

  return (
    <div className="main-modal">
      {data ? (
        editTemplate ? (
          <h2>Edit Template</h2>
        ) : (
          <h2>
            {data.templateName
              ? `Template: ${data.templateName}`
              : "Edit record"}
          </h2>
        )
      ) : (
        <h2>Add income or expense record</h2>
      )}
      <form onSubmit={addNewRecordHandle}>
        <div className="single-input">
          <label>Record type:</label>
          <select
            name="recordType"
            id="new-record-recordType"
            className="new-record-data input-style-outline"
            defaultValue={data.recordType || ""}
            onChange={recordTypeHandle}
            required
          >
            <option value="">select a record type</option>
            <option value="income">income</option>
            <option value="expense">expense</option>
          </select>
        </div>
        <div className="single-input">
          <label htmlFor="new-record-type">Type:</label>
          <select
            name="type"
            id="new-record-type"
            className="new-record-data input-style-outline"
            defaultValue={data.type || ""}
          >
            {!selectedRecordType ? (
              <option value="">Please select a record type</option>
            ) : (
              <option value="">Please select a type</option>
            )}
            {selectedRecordType &&
              (selectedRecordType === "income"
                ? incomeTypes.map((type, index) => (
                    <option key={`new-record-income-type${index}`} value={type}>
                      {type}
                    </option>
                  ))
                : expenseTypes.map((type, index) => (
                    <option
                      key={`new-record-expense-type${index}`}
                      value={type}
                    >
                      {type}
                    </option>
                  )))}
          </select>
        </div>
        <div className="single-input">
          <label htmlFor="new-record-date">Date:</label>
          <input
            type="date"
            name="date"
            id="new-record-date"
            className="new-record-data input-style-bottom"
            defaultValue={data.date || ""}
            required
          />
        </div>
        <div className="single-input">
          <label htmlFor="new-record-amount">Amount:</label>
          <input
            type="number"
            name="amount"
            id="new-record-amount"
            className="new-record-data input-style-bottom"
            min="0"
            step="0.1"
            defaultValue={data.amount || ""}
            required
          />
        </div>
        <div className="single-input">
          <label htmlFor="new-record-name">Name:</label>
          <input
            type="text"
            name="name"
            id="new-record-name"
            className="new-record-data input-style-bottom"
            maxLength="40"
            defaultValue={data.name || ""}
            required
          />
        </div>
        <div className="single-input">
          <label htmlFor="new-record-comment">Comment:</label>
          <textarea
            name="comment"
            id="new-record-comment"
            className="new-record-data input-style-bottom"
            maxLength="400"
            onChange={textareaCountHandle}
            defaultValue={data.comment || ""}
          ></textarea>
          <p className="gray-text">count: {characterCount}</p>
          <p className="gray-text">
            Please note that the comment field has a word limit of 400
            characters.
          </p>
        </div>
        {saveAsTemplate && (
          <div className="save-as-template-container">
            <div className="single-input">
              <label htmlFor="new-record-templateName">Template Name:</label>
              <input
                type="text"
                name="templateName"
                className="input-style-bottom"
                id="new-record-templateName"
                maxLength="40"
                defaultValue={data?.templateName || ""}
                required
              />
            </div>
          </div>
        )}
        <div className="error-text">{error}</div>
        <div className="btns-container">
          {data && !editTemplate ? (
            data.templateName && (
              <>
                <button
                  type="button"
                  className="btn red-btn"
                  onClick={removeTemplateHandle}
                >
                  Remove template
                </button>
                <button
                  type="button"
                  className="btn green-btn"
                  onClick={moveToEditTemplate}
                >
                  Edit template
                </button>
              </>
            )
          ) : saveAsTemplate ? (
            <button
              type="button"
              className="btn green-btn"
              onClick={editTemplate ? editTemplateHandle : addTemplateHandle}
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              className="btn green-btn"
              onClick={() => {
                setSaveAsTemplate(true);
              }}
            >
              Save as template
            </button>
          )}
          {data && !data.templateName ? (
            <button
              type="button"
              className="btn green-btn"
              onClick={editRecordHandle}
            >
              Edit
            </button>
          ) : (
            !editTemplate && (
              <button className="btn blue-btn" type="submit">
                Add record
              </button>
            )
          )}
        </div>
      </form>
    </div>
  );
}

export default NewRecord;
