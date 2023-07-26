import React, { useContext } from "react";
import { Context } from "../Context/context";
import AuthModal from "../Auth/AuthModal";

function Home() {
  const { showModal, setShowModal } = useContext(Context);

  const signupHandle = () => {
    setShowModal("signup");
  };

  return (
    <div className="home-page">
      {["login", "signup"].includes(showModal) && <AuthModal />}
      <div className="background-container">
        <img src="/homePageBackgroundImg.png" alt="home page" />
      </div>
      <div className="page-content-container intro-container">
        <div className="logo-container">
          <img src="/logo192.png" alt="Pocket Save Logo" id="nav-logo" />
          <h2>Pocket Save</h2>
        </div>
        <p>
          Welcome to Pocket Save! Keep track of your income and expenses, set
          savings targets, and make informed decisions with our dashboard page.
          Sign up today and take control of your financial future!
        </p>
        <button
          type="button"
          className="btn deep-blue-btn"
          onClick={signupHandle}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
