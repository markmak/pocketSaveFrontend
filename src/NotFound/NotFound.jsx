import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { TbError404, TbFaceIdError } from "react-icons/tb";
import { AiFillHome } from "react-icons/ai";
import { Context } from "../Context/context";

function NotFound() {
  const { user, setCurrentPage } = useContext(Context);
  const clickHandle = () => {
    setCurrentPage("dashboard");
  };
  return (
    <div className={`not-found-page ${!user && "no-user-not-found"}`}>
      <div className="page-content-container">
        <h1 className="not-found-title">Page not found ...</h1>
        <div className="not-found-icon-container">
          <TbError404 className="not-found-icon jump" />
          <TbFaceIdError className="not-found-icon" />
        </div>
        <h3 className="not-found-text">
          Oops! We can't find the page you were looking for.
        </h3>
        <Link
          className="btn blue-btn back-to-home-btn"
          to="/"
          onClick={clickHandle}
        >
          <AiFillHome className="not-found-home-icon" />
          <span>Back to home</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
