import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context/context";
import CurrentTarget from "../Target/CurrentTarget";
import ExpensesCompositionChart from "./Charts/ExpensesCompositionChart";
import IncomeExpensesChart from "./Charts/IncomeExpensesChart";
import NetWorthOverTime from "./Charts/NetWorthOverTime";
import SavingProgressChart from "./Charts/SavingProgressChart";
import { TbTarget } from "react-icons/tb";
import axios from "axios";
import { baseURL } from "../lookup";

function Dashboard() {
  const { currentTarget, setCurrentTarget, check401Error } =
    useContext(Context);
  const [recordData, setRecordData] = useState(null);
  const [error, setError] = useState({ target: "", record: "" });
  const [isLoading, setIsLoading] = useState(true);
  const updateDataList = [setCurrentTarget, setRecordData];

  const getData = async () => {
    const currentTargetRequest = axios.get(baseURL + "target/currentTarget", {
      withCredentials: true,
    });
    const recordDataRequest = axios.get(baseURL + "dashboard", {
      withCredentials: true,
    });
    try {
      const rawDataList = await Promise.allSettled([
        currentTargetRequest,
        recordDataRequest,
      ]);
      const fetchError = { target: "", record: "" };
      rawDataList.forEach((rawData, index) => {
        if (rawData.status === "fulfilled") {
          const processedData = rawData.value.data;
          if (!index) {
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
          fetchError[index ? "record" : "target"] =
            err?.response?.data?.errMsg ||
            "Internal server error, please try again later.";
        }
      });
      setError(fetchError);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError({
        target: "Internal server error, please try again later.",
        record: "Internal server error, please try again later.",
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <main className="dashboard-page">
      <h2>Dashboard</h2>
      <h3>Income and Expenses Report</h3>
      {error.record ? (
        <div className="page-content-container">
          <p className="error-text">{error.record}</p>
        </div>
      ) : isLoading ? (
        <>
          <div className="loading loading-mid"></div>
          <div className="loading loading-mid"></div>
          <div className="loading loading-mid"></div>
        </>
      ) : (
        <>
          <div className="expenses-composition-chart page-content-container chart-container">
            <ExpensesCompositionChart
              data={recordData.filter((data) => data.recordType === "expense")}
            />
          </div>
          <div className="income-expenses-chart page-content-container chart-container">
            <IncomeExpensesChart data={recordData} />
          </div>
          <div className="net-worth-over-time-chart page-content-container chart-container">
            <NetWorthOverTime data={recordData} />
          </div>
        </>
      )}
      <h3>Current Target</h3>
      {error.target ? (
        <div className="error-box">{error.target}</div>
      ) : (
        <>
          <div className="current-target-container">
            <div className="target-overview">
              {isLoading ? (
                <div className="loading"></div>
              ) : currentTarget ? (
                <CurrentTarget data={currentTarget} />
              ) : (
                <div className="no-current-target page-content-container">
                  <TbTarget className="current-target-icon" />
                  <p>
                    Start building your financial future today by setting a
                    savings target that inspires you to reach new heights of
                    financial success.
                  </p>
                </div>
              )}
            </div>
          </div>
          {isLoading ? (
            <div className="loading loading-mid"></div>
          ) : (
            <div className="saving-progress-chart page-content-container chart-container">
              {currentTarget?.savingRecord?.length ? (
                <SavingProgressChart data={currentTarget} />
              ) : (
                <div className="no-current-target">
                  <p>
                    Set up target and allocate saving to view saving progress.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default Dashboard;
