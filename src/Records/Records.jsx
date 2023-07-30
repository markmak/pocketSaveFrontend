import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context/context";
import { MdEdit } from "react-icons/md";
import { baseURL, typeIconLookup } from "../lookup";
import RecordModal from "./Modal/RecordModal";
import RecordsTable from "./RecordsTable";
import axios from "axios";

function Records() {
  const { showModal, setShowModal, check401Error } = useContext(Context);
  const [templates, setTemplates] = useState([]);
  const [records, setRecords] = useState({});
  const [recordPage, setRecordPage] = useState(1);
  const [isLoading, setIsLoading] = useState({ template: true, record: true });
  const [error, setError] = useState({ template: "", record: "" });

  const checkAndSetErrMsg = (err, key) => {
    setError((prev) => ({
      ...prev,
      [key]:
        err?.response?.data?.errMsg ||
        "Internal server error, please try again later.",
    }));
  };

  const updateTemplates = async () => {
    setIsLoading((prev) => ({ ...prev, template: true }));
    try {
      const rawTemplates = await axios.get(baseURL + "record/template", {
        withCredentials: true,
      });
      const rawData = rawTemplates.data;
      rawData.forEach((template) => {
        template.date = template.date?.substring(0, 10) || "";
      });
      setTemplates(rawData);
      setIsLoading((prev) => ({ ...prev, template: false }));
    } catch (err) {
      check401Error(err);
      checkAndSetErrMsg(err, "template");
      setIsLoading((prev) => ({ ...prev, template: false }));
    }
  };

  const updateRecords = async (queryString = "?page=1") => {
    setIsLoading((prev) => ({ ...prev, record: true }));
    try {
      const rawRecords = await axios.get(baseURL + `record/${queryString}`, {
        withCredentials: true,
      });
      const rawData = rawRecords.data.data;
      rawData.forEach((record) => {
        record.date = record.date.substring(0, 10);
      });
      setRecords(rawRecords.data);
      setIsLoading((prev) => ({ ...prev, record: false }));
    } catch (err) {
      check401Error(err);
      checkAndSetErrMsg(err, "record");
      setIsLoading((prev) => ({ ...prev, record: false }));
    }
  };

  useEffect(() => {
    updateTemplates();
  }, []);

  return (
    <main className="records-page">
      {showModal && (
        <RecordModal
          updateTemplates={updateTemplates}
          updateRecords={updateRecords}
          setRecordPage={setRecordPage}
        />
      )}
      <div className="add-record-container">
        <div
          className="add-record-target-container add-record-template"
          onClick={() => {
            setShowModal({ type: "newRecord", data: "" });
          }}
        >
          <MdEdit className="add-record-template-icon" />
          <p className="add-record-template-text">Add a record or template</p>
        </div>
        <div className="templates-container">
          <h3>Templates</h3>
          {error.template ? (
            <div className="page-content-container">
              <p className="error-text">{error.template}</p>
            </div>
          ) : isLoading.template ? (
            <div className="loading"></div>
          ) : templates.length ? (
            <div className="template-grid">
              {templates.map((template, index) => {
                const { templateName, recordType, type } = template;
                return (
                  <div
                    className={`single-template ${
                      recordType === "income"
                        ? "template-income"
                        : "template-expense"
                    }`}
                    key={`record-template-${index}`}
                    onClick={() =>
                      setShowModal({
                        type: "newRecord",
                        data: template,
                      })
                    }
                  >
                    {typeIconLookup[type]}
                    <p className="template-name">
                      {templateName.length > 20
                        ? templateName.substring(0, 18) + "..."
                        : templateName}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="page-content-container no-template">
              <p>
                Add record templates to add your income or expense record with
                ease.
              </p>
            </div>
          )}
        </div>
      </div>
      <h2 className="title-records">Income and Expense records</h2>
      <div className="records-table-container page-content-container">
        {error.record ? (
          <div className="page-content-container">
            <p className="error-text">{error.record}</p>
          </div>
        ) : (
          <RecordsTable
            records={records}
            updateRecords={updateRecords}
            isLoading={isLoading.record}
            recordPage={recordPage}
            setRecordPage={setRecordPage}
          />
        )}
      </div>
    </main>
  );
}

export default Records;
