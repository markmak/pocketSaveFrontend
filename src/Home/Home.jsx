import React, { useContext, useEffect } from "react";
import { Context } from "../Context/context";
import AuthModal from "../Auth/AuthModal";
import { CiEdit, CiWavePulse1, CiGps } from "react-icons/ci";

function Home() {
  const { showModal, setShowModal } = useContext(Context);

  const signupHandle = () => {
    setShowModal("signup");
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          entry.target.classList.remove("show");
        }
      });
    });
    document
      .querySelectorAll(".text-container")
      .forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="home-page">
        {["login", "signup"].includes(showModal) && <AuthModal />}
        <div className="intro-container">
          <h2>Welcome to Pocket Save</h2>
          <p className="fade-in-1">
            Keep track of your income and expenses, set savings targets, and
            more...
          </p>
          <button
            type="button"
            className="auth-btn auth-btn-blue"
            onClick={signupHandle}
          >
            Join now
          </button>
          <p className="fade-in-2">
            Sign up today and take control of your financial future.
          </p>
        </div>
      </div>
      <div className="features">
        <div className="single-feature">
          <div className="feature-img-container">
            <img src="/records.png" alt="records" />
          </div>
          <div className="text-container">
            <CiEdit className="feature-icon" />
            <p>Record incomes and expenses</p>
          </div>
        </div>
        <div className="single-feature">
          <div className="text-container">
            <CiGps className="feature-icon" />
            <p>Set saving targets and track progress</p>
          </div>
          <div className="feature-img-container">
            <img className="img-top" src="/targets.png" alt="targets" />
          </div>
        </div>
        <div className="single-feature">
          <div className="feature-img-container">
            <img src="/dashboard.png" alt="dashboard" />
          </div>
          <div className="text-container">
            <CiWavePulse1 className="feature-icon" />
            <p>Visualize your progress through charts and graphs</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
