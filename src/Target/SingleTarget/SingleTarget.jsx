import React, { useContext, useEffect, useState } from "react";
import ViewTarget from "./ViewTarget";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../lookup";
import { Context } from "../../Context/context";

function SingleTarget() {
  const { checkErrorAndLogout } = useContext(Context);
  const { targetId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const getData = async () => {
    setIsLoading(true);
    try {
      const rawData = await axios.get(baseURL + `target/${targetId}`, {
        withCredentials: true,
      });
      const processedData = rawData.data;
      processedData.createdAt = processedData.createdAt?.substring(0, 10) || "";
      processedData.completedDate =
        processedData.completedDate?.substring(0, 10) || "";
      setData(processedData);
      setIsLoading(false);
    } catch (err) {
      checkErrorAndLogout(err, setError);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <main className="single-target">
      {error ? (
        <div className="page-content-container">
          <p className="error-text">{error}</p>
        </div>
      ) : isLoading ? (
        <>
          <div className="loading loading-mid"></div>
          <div className="loading loading-mid"></div>
          <div className="loading loading-mid"></div>
          <div className="loading loading-mid"></div>
        </>
      ) : (
        <ViewTarget data={data} updateTarget={getData} />
      )}
      <Link className="btn blue-btn back-to-target-btn" to="/target">
        <FaArrowLeft className="icon" />
        <span>Back to Target page</span>
      </Link>
    </main>
  );
}

export default SingleTarget;
