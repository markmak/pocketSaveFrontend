import React, { useContext } from "react";
import { Context } from "../Context/context";
import { Link } from "react-router-dom";
import { imgBaseURL, sideBarPages } from "../lookup";

function SideBar() {
  const { user, currentPage, setCurrentPage, showSidebar, setShowSidebar } =
    useContext(Context);
  const { img, name, email } = user;

  return (
    <aside className={`${showSidebar ? "sidebar-open" : ""}`}>
      <Link
        className="sidebar-logo-container"
        to="/dashboard"
        onClick={() => {
          setShowSidebar(false);
          setCurrentPage("dashboard");
        }}
      >
        <img src="/logo192.png" alt="Pocket Save Logo" id="sidebar-logo" />
        <span>Pocket Save</span>
      </Link>
      <div className="user-info-container">
        <img
          src={img ? `${imgBaseURL}${img}` : "/logo192.png"}
          alt="User icon"
          className="user-icon"
        />
        <div className="user-info">
          <div className="user-name">Welcome, {name}</div>
          <div className="user-email">{email}</div>
        </div>
      </div>
      <div className="page-container">
        {sideBarPages.map((page) => {
          const { name, icon } = page;
          return (
            <Link
              to={`/${name}`}
              className={`sidebar-single-item sidebar-${name} ${
                currentPage === name && "sidebar-current-page-text"
              }`}
              onClick={() => {
                setCurrentPage(name);
                setShowSidebar(false);
              }}
              key={`sidebar-${name}`}
            >
              {icon}
              <span>{name}</span>
              <div
                className={`sidebar-page-select ${
                  currentPage === name && "sidebar-current-page"
                }`}
              ></div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export default SideBar;
