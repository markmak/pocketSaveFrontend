import React, { useContext, useEffect, useState } from "react";
import { TbTargetArrow, TbTarget } from "react-icons/tb";
import TargetHistory from "./TargetHistory";
import NewTargetModal from "./Modal/NewTargetModal";
import { Context } from "../Context/context";
import CurrentTarget from "./CurrentTarget";
import axios from "axios";
import { baseURL } from "../lookup";

function Target() {
  const [targetList, setTargetList] = useState(null);
  const {
    currentTarget,
    setCurrentTarget,
    showModal,
    setShowModal,
    check401Error,
    checkErrorAndLogout,
  } = useContext(Context);
  const [error, setError] = useState({ currentTarget: "", targetList: "" });
  const [isLoading, setIsLoading] = useState({
    currentTarget: true,
    targetList: true,
  });
  const updateDataList = [setCurrentTarget, setTargetList];

  const getData = async () => {
    const currentTargetRequest = axios.get(baseURL + "target/currentTarget", {
      withCredentials: true,
    });
    const targetListRequest = axios.get(baseURL + "target/", {
      withCredentials: true,
    });
    try {
      const rawDataList = await Promise.allSettled([
        currentTargetRequest,
        targetListRequest,
      ]);
      const fetchError = { currentTarget: "", targetList: "" };
      rawDataList.forEach((rawData, index) => {
        if (rawData.status === "fulfilled") {
          const processedData = rawData.value.data;
          if (index === 0) {
            if (processedData) {
              processedData.createdAt =
                processedData.createdAt?.substring(0, 10) || "";
            }
          } else {
            if (processedData.length) {
              processedData.forEach((data) => {
                data.createdAt = data.createdAt?.substring(0, 10) || "";
              });
            }
          }
          updateDataList[index](processedData);
        } else {
          const err = rawData.reason;
          check401Error(err);
          fetchError[index ? "targetList" : "currentTarget"] =
            err?.response?.data?.errMsg ||
            "Internal server error, please try again later.";
        }
      });
      setError(fetchError);
      setIsLoading({ currentTarget: false, targetList: false });
    } catch (err) {
      setError("Internal Server Error, please try again later");
      setIsLoading({ currentTarget: false, targetList: false });
    }
  };

  const getTargetList = async () => {
    setIsLoading({ currentTarget: false, targetList: true });
    try {
      const rawTargetList = await axios.get(baseURL + "target/", {
        withCredentials: true,
      });
      const processedData = rawTargetList.data;
      if (processedData.length) {
        processedData.forEach((target) => {
          target.createdAt = target.createdAt?.substring(0, 10) || "";
        });
      }
      setTargetList(processedData);
      setIsLoading({ currentTarget: false, targetList: false });
    } catch (err) {
      checkErrorAndLogout(err, setError);
      setIsLoading({ currentTarget: false, targetList: false });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <main className="target-page">
      {showModal && <NewTargetModal getTargetList={getTargetList} />}
      <div className="top-container">
        <div
          className="add-record-target-container add-target"
          onClick={() => {
            setShowModal("addTarget");
          }}
        >
          <TbTargetArrow className="add-target-icon" />
          <p>Set a target</p>
        </div>
        <div className="current-target-container">
          <h3>Current Target</h3>
          {error.currentTarget ? (
            <div className="page-content-container">
              <p className="error-text">{error.currentTarget}</p>
            </div>
          ) : isLoading.currentTarget ? (
            <div className="loading"></div>
          ) : currentTarget ? (
            <CurrentTarget data={currentTarget} />
          ) : (
            <div className="no-current-target page-content-container">
              <TbTarget className="current-target-icon" />
              <p>
                Start building your financial future today by setting a savings
                target that inspires you to reach new heights of financial
                success.
              </p>
            </div>
          )}
        </div>
      </div>
      <h2>Target History</h2>

      {error.targetList ? (
        <div className="page-content-container">
          <p className="error-text">{error.targetList}</p>
        </div>
      ) : isLoading.targetList ? (
        <div className="loading loading-long"></div>
      ) : (
        <div className="page-content-container target-history-container">
          <TargetHistory data={targetList} />
        </div>
      )}
    </main>
  );
}

export default Target;
