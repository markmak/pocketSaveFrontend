import React, { useContext, useState } from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { MdEditDocument } from "react-icons/md";
import { Context } from "../../Context/context";
import SingleTargetModal from "./Modal/SingleTargetModal";
import { baseURL, imgBaseURL } from "../../lookup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SavingProgressChart from "../../Dashboard/Charts/SavingProgressChart";

function ViewTarget({ data, updateTarget }) {
  const { showModal, setShowModal, checkErrorAndLogout } = useContext(Context);
  const navigate = useNavigate();
  const {
    _id,
    img,
    name,
    status,
    amount,
    createdAt,
    completedDate,
    targetSavingPeriod,
    comment,
    savingRecord,
  } = data;
  const [filter, setFilter] = useState({ startDate: "", endDate: "" });
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const prevPageHandle = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const nextPageHandle = () => {
    if (filteredData.length) {
      const maxPage = Math.ceil(filteredData.length / 10);
      if (page < maxPage) {
        setPage(page + 1);
      }
    }
  };

  const convertDate = (date) => {
    const [week, month, day, year] = new Date(date).toDateString().split(" ");
    return `${week} ${day} ${month} ${year}`;
  };

  const addSavingHandle = () => {
    setShowModal({
      type: "addSaving",
      data: { _id, amount, targetSavingPeriod, savingRecord },
    });
  };
  const changeStatusHandle = () => {
    setShowModal({
      type: "changeStatus",
      data: { _id, amount, savingRecord, status },
    });
  };
  const editTargetHandle = () => {
    setShowModal({
      type: "editTarget",
      data: {
        _id,
        name,
        amount,
        createdAt,
        targetSavingPeriod,
        completedDate,
        status,
        comment,
      },
    });
  };
  const removeTargetHandle = async () => {
    try {
      await axios.delete(baseURL + `target/${_id}`, { withCredentials: true });
      setShowModal("");
      navigate("/target");
    } catch (err) {
      checkErrorAndLogout(err, setError);
    }
  };

  const filterHandle = (e) => {
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;
    setFilter((prev) => {
      return { ...prev, [name]: value };
    });
    setPage(1);
  };

  let filteredData = savingRecord;
  if (filter.startDate || filter.endDate) {
    const compareStateDate = filter.startDate
      ? new Date(filter.startDate).getTime()
      : 0;
    const compareEndDate = filter.endDate
      ? new Date(filter.endDate).getTime()
      : Number.POSITIVE_INFINITY;
    filteredData = filteredData.filter((record) => {
      const recordDate = new Date(record.date).getTime();
      return recordDate >= compareStateDate && recordDate <= compareEndDate;
    });
  }

  return (
    <>
      {showModal && <SingleTargetModal updateTarget={updateTarget} />}
      <img src={img ? `${imgBaseURL}${img}` : "/logo192.png"} alt="target" />
      <h2>{name}</h2>
      <div className="target-info page-content-container">
        <h4>Amount: </h4>
        <p>{amount}</p>
        <h4>Target saving period: </h4>
        <p>{targetSavingPeriod}</p>
        <h4>Monthly saving target: </h4>
        <p>{Math.ceil(amount / targetSavingPeriod)}</p>
        <h4>Total allocated saving:</h4>
        <p>
          {savingRecord.reduce((a, c) => a + c.amount, 0)}/{amount}
        </p>
        <div className="progress-bar-container">
          <div
            className="progress"
            style={{
              width: `${Math.floor(
                (savingRecord.reduce((a, c) => a + c.amount, 0) * 100) / amount
              )}%`,
            }}
          ></div>
        </div>
        <h4>Created date: </h4>
        <p>{convertDate(createdAt)}</p>
        <h4>Completed date: </h4>
        <p>{completedDate ? convertDate(completedDate) : "On going target"}</p>
        <h4>Status: </h4>
        <p className="target-status">{status}</p>
        <h4>Comment: </h4>
        <p className="comment">{comment || "No comment added."}</p>
        <div className="error-text">{error}</div>
        <div className="btns-container">
          {status === "on going" && (
            <button
              type="button"
              className="btn green-btn"
              onClick={addSavingHandle}
            >
              Allocate saving
            </button>
          )}
          <button
            type="button"
            className="btn green-btn"
            onClick={changeStatusHandle}
          >
            Change status
          </button>
          <button
            type="button"
            className="btn blue-btn"
            onClick={editTargetHandle}
          >
            Edit target
          </button>
          <button
            type="button"
            className="btn red-btn"
            onClick={removeTargetHandle}
          >
            Remove target
          </button>
        </div>
      </div>
      <h2>Saving Record</h2>
      <div className="Saving-progress-chart page-content-container chart-container">
        {savingRecord.length ? (
          <SavingProgressChart
            data={{ createdAt, targetSavingPeriod, savingRecord, amount }}
          />
        ) : (
          <div className="no-saving-record">
            <p className="no-record">
              Allocate saving to view saving progress.
            </p>
          </div>
        )}
      </div>
      <div className="saving-record-container page-content-container">
        <div className="filter-container">
          <div className="filter-group">
            <div>Created Date: </div>
            <div className="filter-date-container">
              <label htmlFor="saving-record-filter-start-date">From:</label>
              <input
                type="date"
                name="startDate"
                className="input-style-bottom"
                id="saving-record-filter-start-date"
                onChange={filterHandle}
                value={filter.startDate}
              />
            </div>
            <div className="filter-date-container">
              <label htmlFor="saving-record-filter-end-date">To:</label>
              <input
                type="date"
                name="endDate"
                className="input-style-bottom"
                id="saving-record-filter-end-date"
                onChange={filterHandle}
                value={filter.endDate}
              />
            </div>
          </div>
        </div>
        <div className="table-container">
          <table className="saving-table">
            <tbody>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
              {filteredData
                .slice((page - 1) * 10, page * 10)
                .map((record, index) => {
                  const { date, amount } = record;
                  return (
                    <tr key={`saving${index}`}>
                      <td>{convertDate(date)}</td>
                      <td>{amount}</td>
                      <td
                        className="saving-table-icon-cell"
                        onClick={() =>
                          setShowModal({
                            type: "editSaving",
                            data: {
                              ...record,
                              date: date.substring(0, 10),
                              totalAmount: data.amount,
                              createdAt,
                            },
                          })
                        }
                      >
                        <MdEditDocument className="saving-table-icon" />
                        <span>Edit</span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {filteredData.length ? (
          <div className="page-select-container">
            <span className="total-container">
              Showing {`${(page - 1) * 10 + 1} -`}
              {page * 10 > filteredData.length
                ? ` ${filteredData.length}`
                : ` ${page * 10}`}
              , total: {filteredData.length}{" "}
              {filteredData.length > 1 ? "records" : "record"}
            </span>
            <span className="page-select btn blue-btn" onClick={prevPageHandle}>
              <BiLeftArrow className="page-select-icon" />
              <span>Prev</span>
            </span>
            <span className="current-page">{page}</span>
            <span className="page-select btn blue-btn" onClick={nextPageHandle}>
              <span>Next</span>
              <BiRightArrow className="page-select-icon" />
            </span>
          </div>
        ) : savingRecord.length ? (
          <div className="no-match-record">No match saving record ...</div>
        ) : (
          <div className="no-match-record">No saving record added ...</div>
        )}
      </div>
    </>
  );
}

export default ViewTarget;
