import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import SideBar from "./Sidear/SideBar";
import Home from "./Home/Home";
import Dashboard from "./Dashboard/Dashboard";
import Records from "./Records/Records";
import Target from "./Target/Target";
import SingleTarget from "./Target/SingleTarget/SingleTarget";
import Setting from "./Setting/Setting";
import NotFound from "./NotFound/NotFound";
import Footer from "./Footer/Footer";
import { Context } from "./Context/context";
import { useContext } from "react";

function App() {
  const { showSidebar, setShowSidebar, showModal, setShowModal, user } =
    useContext(Context);

  const checkAuthAndNavigate = (page) => {
    return user ? page : <Navigate to="/" />;
  };
  const closeModal = () => {
    setShowModal("");
  };
  const closeSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <BrowserRouter>
      <Navbar />
      {showModal && <div id="close-Modal" onClick={closeModal}></div>}
      {showSidebar && <div id="close-Sidebar" onClick={closeSidebar}></div>}
      {user && <SideBar />}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Home />}
        />
        <Route
          path="/dashboard"
          element={checkAuthAndNavigate(<Dashboard />)}
        />
        <Route path="/target" element={checkAuthAndNavigate(<Target />)} />
        <Route
          path="/target/:targetId"
          element={checkAuthAndNavigate(<SingleTarget />)}
        />
        <Route path="/records" element={checkAuthAndNavigate(<Records />)} />
        <Route path="/setting" element={checkAuthAndNavigate(<Setting />)} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
