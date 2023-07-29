import React, { useContext } from "react";
import { BiSearch, BiMenu } from "react-icons/bi";
import AuthButtons from "../Auth/AuthButtons";
import { Context } from "../Context/context";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { user, setShowSidebar, setRecordsFilter, setCurrentPage } =
    useContext(Context);
  const navigate = useNavigate();

  const searchHandle = (e) => {
    e.preventDefault();
    const value = document.getElementById("serach-input").value;
    setRecordsFilter((prev) => ({ ...prev, name: value }));
    navigate("/records");
    setCurrentPage("records");
  };
  const iconClickHandle = () => {
    setCurrentPage("dashborad");
  };
  const openSidebar = () => {
    setShowSidebar(true);
  };
  return (
    <nav>
      {user && (
        <BiMenu
          className="menu-btn"
          id="menu-icon-open"
          onClick={openSidebar}
        />
      )}
      <Link
        className="logo-container"
        to="/dashboard"
        onClick={iconClickHandle}
      >
        <img src="/logo192.png" alt="Pocket Save Logo" id="nav-logo" />
        <span>Pocket Save</span>
      </Link>
      <form className="search-container" onSubmit={searchHandle}>
        {user && (
          <>
            <input
              type="text"
              name="record"
              id="serach-input"
              placeholder="Search records..."
            />
            <button type="submit" id="nav-search-button">
              <BiSearch className="icons bi-icons" id="nav-serach-icon" />
            </button>
          </>
        )}
      </form>

      <AuthButtons />
    </nav>
  );
}

export default Navbar;
