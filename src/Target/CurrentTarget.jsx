import React, { useContext } from "react";
import { TbTarget } from "react-icons/tb";
import { Link } from "react-router-dom";
import { imgBaseURL } from "../lookup";
import { Context } from "../Context/context";

function CurrentTarget({ data }) {
  const { setCurrentPage } = useContext(Context);
  const { _id, img, name, amount, savingRecord } = data;

  const clickHandle = () => {
    setCurrentPage("target");
  };
  let lastAllocatedInfo = "No allocated saving record";
  if (savingRecord.length > 0) {
    const { date, amount } = savingRecord.at(-1);
    const [week, month, day, year] = new Date(date).toDateString().split(" ");
    lastAllocatedInfo = `Date: ${week} ${day} ${month} ${year}, Amount: ${amount}`;
  }
  return (
    <div className="page-content-container">
      <Link to={`/target/${_id}`} onClick={clickHandle}>
        <img
          src={img ? `${imgBaseURL}${img}` : "/logo192.png"}
          alt="current target"
        />
      </Link>
      <div className="current-target-info">
        <h4>{name.length > 20 ? name.substring(20) + "..." : name}</h4>

        <h5>Last allocated saving:</h5>
        <p>{lastAllocatedInfo}</p>
        <h5>Total allocated saving:</h5>
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
      </div>
      <Link
        className="link btn blue-btn"
        to={`/target/${_id}`}
        onClick={clickHandle}
      >
        <TbTarget className="view-icon" />
        <div>View Target</div>
      </Link>
    </div>
  );
}

export default CurrentTarget;
