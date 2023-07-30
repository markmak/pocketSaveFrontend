import React, { useContext, useEffect } from "react";
import { Context } from "../Context/context";
import { AiFillEye } from "react-icons/ai";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { typeIconLookup } from "../lookup";
import { incomeTypes, expenseTypes, filterKeys } from "../lookup";

function RecordsTable({
  records,
  updateRecords,
  isLoading,
  recordPage,
  setRecordPage,
}) {
  const { recordsFilter, setRecordsFilter, setShowModal } = useContext(Context);

  const createQueryString = (newFilter, page = "?page=1") => {
    return filterKeys.reduce((a, c) => {
      if (newFilter[c]) {
        a += `&${c}=${newFilter[c]}`;
      }
      return a;
    }, page);
  };

  const filterHandle = (e) => {
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;
    const newFilter = { ...recordsFilter, [name]: value };
    setRecordsFilter(newFilter);
    setRecordPage(1);
  };
  const recordTypeFilterHandle = (e) => {
    const value = e.currentTarget.value;
    const newFilter = { ...recordsFilter, recordType: value, type: "" };
    setRecordsFilter(newFilter);
    setRecordPage(1);
  };

  const prevPageHandle = () => {
    if (recordPage > 1) {
      setRecordPage(recordPage - 1);
      const queryString = createQueryString(
        recordsFilter,
        `?page=${recordPage - 1}`
      );
      updateRecords(queryString);
    }
  };
  const nextPageHandle = () => {
    if (records.count) {
      const maxPage = Math.ceil(records.count / 20);
      if (recordPage < maxPage) {
        setRecordPage(recordPage + 1);
        const queryString = createQueryString(
          recordsFilter,
          `?page=${recordPage + 1}`
        );
        updateRecords(queryString);
      }
    }
  };
  useEffect(() => {
    const queryString = createQueryString(recordsFilter);
    updateRecords(queryString);
  }, [recordsFilter]);
  return (
    <>
      <div className="filter-container">
        <span className="filter-group">
          <div>Date: </div>
          <div className="filter-date-container">
            <label htmlFor="records-filter-start-date">From:</label>
            <input
              type="date"
              name="startDate"
              className="input-style-bottom"
              id="records-filter-start-date"
              value={recordsFilter.startDate}
              onChange={filterHandle}
            />
          </div>
          <div className="filter-date-container">
            <label htmlFor="records-filter-end-date">To:</label>
            <input
              type="date"
              name="endDate"
              className="input-style-bottom"
              id="records-filter-end-date"
              value={recordsFilter.endDate}
              onChange={filterHandle}
            />
          </div>
        </span>
        <span className="filter-group">
          <label htmlFor="records-filter-recordType">Record type: </label>
          <select
            name="recordType"
            className="input-style-outline"
            id="records-filter-recordType"
            onChange={recordTypeFilterHandle}
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </span>
        <span className="filter-group">
          <label htmlFor="records-filter-type">Type: </label>
          <select
            name="type"
            className="input-style-outline"
            id="records-filter-type"
            onChange={filterHandle}
          >
            <option value="">All</option>
            {!recordsFilter.recordType &&
              incomeTypes
                .toSpliced(3, 1, ...expenseTypes)
                .map((type, index) => (
                  <option key={`records-filter-all-type${index}`} value={type}>
                    {type}
                  </option>
                ))}
            {recordsFilter.recordType === "income" &&
              incomeTypes.map((type, index) => (
                <option key={`records-filter-income-type${index}`} value={type}>
                  {type}
                </option>
              ))}
            {recordsFilter.recordType === "expense" &&
              expenseTypes.map((type, index) => (
                <option
                  key={`records-filter-expense-type${index}`}
                  value={type}
                >
                  {type}
                </option>
              ))}
          </select>
        </span>
      </div>
      <div className="filter-group">
        <label htmlFor="record-search-input">Search name: </label>
        <input
          type="text"
          name="name"
          className="input-style-bottom"
          id="record-search-input"
          placeholder="Search records..."
          value={recordsFilter.name}
          onChange={filterHandle}
        />
      </div>
      {isLoading ? (
        <div className="loading loading-long"></div>
      ) : !records.totalCount ? (
        <>
          <table className="records-table">
            <tbody className="records-table-body">
              <tr>
                <th></th>
                <th>Date</th>
                <th>Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Comment</th>
                <th>Action</th>
              </tr>
              {records.data.map((record) => {
                const { _id, recordType, date, name, type, amount, comment } =
                  record;
                const [week, month, day, year] = new Date(date)
                  .toDateString()
                  .split(" ");
                const displayDate = `${week} ${day} ${month} ${year}`;
                return (
                  <tr className="records-table-data-row" key={_id}>
                    <td
                      className={`${
                        recordType === "income"
                          ? "records-table-data-income"
                          : "records-table-data-expense"
                      }`}
                    ></td>
                    <td>{displayDate}</td>
                    <td>
                      {name.length > 20 ? name.substring(0, 17) + "..." : name}
                    </td>
                    <td
                      className={`records-table-icon-cell records-table-icon-${
                        recordType === "income" ? "income" : "expense"
                      }-cell`}
                    >
                      {typeIconLookup[type]}
                      <span className="records-table-icon-text">{type}</span>
                    </td>
                    <td>{amount}</td>
                    <td>
                      {comment?.length > 40
                        ? comment.substring(0, 40) + "..."
                        : comment}
                    </td>
                    <td
                      className="records-table-icon-cell"
                      onClick={() =>
                        setShowModal({ type: "view", data: record })
                      }
                    >
                      <AiFillEye className="record-table-icon" />
                      <span>View</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {records.count > 0 ? (
            <div className="page-select-container">
              <span className="total-container">
                Showing {`${(recordPage - 1) * 20 + 1} -`}
                {recordPage * 20 > records.count
                  ? ` ${records.count}`
                  : ` ${recordPage * 20}`}
                , total: {records.count}{" "}
                {records.count > 1 ? "records" : "record"}
              </span>
              <span
                className="page-select btn blue-btn"
                onClick={prevPageHandle}
              >
                <BiLeftArrow className="page-select-icon" />
                <span>Prev</span>
              </span>
              <span className="records-current-page">{recordPage}</span>
              <span
                className="page-select btn blue-btn"
                onClick={nextPageHandle}
              >
                <span>Next</span>
                <BiRightArrow className="page-select-icon" />
              </span>
            </div>
          ) : (
            <div className="no-match-record">No match record ...</div>
          )}
        </>
      ) : (
        <table className="records-table">
          <tbody className="records-table-body">
            <tr>
              <th>
                <div className="no-match-record">No record added ...</div>
              </th>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}

export default RecordsTable;
