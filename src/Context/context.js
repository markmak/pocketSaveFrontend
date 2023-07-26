import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../lookup";

const Context = React.createContext();

function AppContext({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState("");
  const [user, setUser] = useState("");
  const [recordsFilter, setRecordsFilter] = useState({
    startDate: "",
    endDate: "",
    recordType: "",
    type: "",
    name: "",
  });
  const [currentTarget, setCurrentTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const getUser = async () => {
    try {
      const user = await axios.get(baseURL + "auth/getUser", {
        withCredentials: true,
      });
      setUser(user.data);
    } catch (err) {
      setUser("");
      setCurrentPage("dashboard");
      setShowModal("");
    }
  };
  const checkErrorAndLogout = (err, setError) => {
    if (err?.response?.status === 401) {
      setUser("");
      setCurrentPage("dashboard");
      setShowModal("");
    } else {
      setError(
        err?.response?.data?.errMsg ||
          "Internal server error, please try again later."
      );
    }
  };
  const check401Error = (err) => {
    if (err?.response?.status === 401) {
      setUser("");
      setCurrentPage("dashboard");
      setShowModal("");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Context.Provider
      value={{
        showSidebar,
        setShowSidebar,
        showModal,
        setShowModal,
        user,
        setUser,
        recordsFilter,
        setRecordsFilter,
        currentTarget,
        setCurrentTarget,
        currentPage,
        setCurrentPage,
        checkErrorAndLogout,
        check401Error,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { AppContext, Context };
