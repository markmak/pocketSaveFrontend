import React, { useState } from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { Link } from "react-router-dom";
import { imgBaseURL } from "../lookup";

function TargetHistory({ data }) {
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    status: "",
    name: "",
  });
  const [page, setPage] = useState(1);
  const { startDate, endDate, status, name } = filter;

  const filterHandle = (e) => {
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;
    setFilter((prev) => {
      return { ...prev, [name]: value };
    });
    setPage(1);
  };
  const prevPageHandle = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const nextPageHandle = () => {
    if (filteredData.length) {
      const maxPage = Math.ceil(filteredData.length / 9);
      if (page < maxPage) {
        setPage(page + 1);
      }
    }
  };
  let filteredData = data;
  if (startDate || endDate) {
    const compareStartDate = startDate ? new Date(startDate).getTime() : 0;
    const compareEndDate = endDate
      ? new Date(endDate).getTime()
      : Number.POSITIVE_INFINITY;
    filteredData = filteredData.filter((target) => {
      const targetDate = new Date(target.createdAt).getTime();
      return targetDate >= compareStartDate && targetDate <= compareEndDate;
    });
  }
  if (status) {
    filteredData = filteredData.filter((target) => status === target.status);
  }
  if (name) {
    filteredData = filteredData.filter((target) => target.name.includes(name));
  }

  return (
    <>
      <div className="filter-container">
        <span className="filter-group">
          <div>Created Date: </div>
          <div className="filter-date-container">
            <label htmlFor="target-history-filter-start-date">From:</label>
            <input
              type="date"
              name="startDate"
              className="input-style-bottom"
              id="target-history-filter-start-date"
              onChange={filterHandle}
              value={filter.startDate}
            />
          </div>
          <div className="filter-date-container">
            <label htmlFor="target-history-filter-end-date">To:</label>
            <input
              type="date"
              name="endDate"
              className="input-style-bottom"
              id="target-history-filter-end-date"
              onChange={filterHandle}
              value={filter.endDate}
            />
          </div>
        </span>
        <span className="filter-group">
          <label htmlFor="target-history-filter-status">Target status: </label>
          <select
            name="status"
            className="input-style-outline"
            id="target-history-filter-status"
            onChange={filterHandle}
            value={filter.status}
          >
            <option value="">All</option>
            <option value="success">success</option>
            <option value="abandon">abandon</option>
          </select>
        </span>
      </div>
      <div className="filter-group">
        <label htmlFor="target-search-input">Search name: </label>
        <input
          type="text"
          name="name"
          className="input-style-bottom"
          id="target-search-input"
          placeholder="Search targets..."
          onChange={filterHandle}
          value={filter.name}
        />
      </div>

      <div className="target-history">
        {data.length < 1 ? (
          <div className="no-match-record">No completed target ...</div>
        ) : (
          <>
            <div className="target-flex-container">
              {filteredData
                .slice((page - 1) * 9, page * 9)
                .map((data, index) => {
                  const { _id, img, name, amount, status, createdAt } = data;
                  const [week, month, day, year] = new Date(createdAt)
                    .toDateString()
                    .split(" ");
                  const displayDate = `${week} ${day} ${month} ${year}`;
                  return (
                    <Link
                      to={`/target/${_id}`}
                      key={`target${index}`}
                      className="single-target-card"
                    >
                      <img
                        src={img ? `${imgBaseURL}${img}` : "/logo192.png"}
                        alt={`target ${name}`}
                      />
                      <h4>
                        {name.length > 20 ? name.substring(15) + " ..." : name}
                      </h4>
                      <div>
                        <h5>Created Date:</h5>
                        <p> {displayDate}</p>
                      </div>
                      <div>
                        <h5>Amount:</h5>
                        <p> {amount}</p>
                      </div>
                      <div className="status-container">
                        <div className={`status status-${status}`}>
                          {status}
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
            {filteredData.length > 0 ? (
              <div className="page-select-container">
                <span className="total-container">
                  Showing {`${(page - 1) * 9 + 1} -`}
                  {page * 9 > filteredData.length
                    ? ` ${filteredData.length}`
                    : ` ${page * 9}`}
                  , total: {filteredData.length}{" "}
                  {filteredData.length > 1 ? "records" : "record"}
                </span>
                <span
                  className="page-select btn blue-btn"
                  onClick={prevPageHandle}
                >
                  <BiLeftArrow className="page-select-icon" />
                  <span>Prev</span>
                </span>
                <span className="current-page">{page}</span>
                <span
                  className="page-select btn blue-btn"
                  onClick={nextPageHandle}
                >
                  <span>Next</span>
                  <BiRightArrow className="page-select-icon" />
                </span>
              </div>
            ) : (
              <div className="no-match-record">No match target ...</div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default TargetHistory;
