import React, { useState, useRef, useMemo } from "react";
import { scaleLinear, scaleTime, extent, line } from "d3";
import { monthLookup } from "../../lookup";

const svgWidth = 500;
const svgHeight = 250;
const margin = { top: 20, right: 20, bottom: 35, left: 60 };
const circleR = 4;
const tickHeight = 5;
const tickTextSize = 10;

function NetWorthOverTime({ data }) {
  const [filter, setFilter] = useState("");
  const [chartType, setChartType] = useState("cumulative");
  const [tooltipValue, setTooltipValue] = useState("");

  let today = new Date();
  today = today.toJSON().substring(0, 10);

  const filterHandle = (e) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  let filteredData = data;
  if (filter.startDate || filter.endDate) {
    const { startDate, endDate } = filter;
    const compareStartDate = startDate ? new Date(startDate).getTime() : 0;
    const compareEndDate = endDate
      ? new Date(endDate).getTime()
      : Number.POSITIVE_INFINITY;
    filteredData = filteredData.filter((record) => {
      const recordDate = new Date(record.date).getTime();
      return recordDate >= compareStartDate && recordDate <= compareEndDate;
    });
  }

  const timeDomain = extent(filteredData, (data) => data.date.substring(0, 7));

  const monthList = [timeDomain[0]];
  while (monthList.at(-1) !== timeDomain[1]) {
    const year = +monthList.at(-1).substring(0, 4);
    const month = +monthList.at(-1).substring(5);
    const nextMonth =
      month === 12
        ? `${year + 1}-01`
        : `${year}-${month > 8 ? month + 1 : "0" + (month + 1)}`;
    monthList.push(nextMonth);
  }

  const fullMonthList = useRef(monthList);
  const cumulativeData = useMemo(() => {
    const binnedData = data.reduce((a, c) => {
      const { recordType, date, amount } = c;
      const key = date.substring(0, 7);
      a[key] = (a[key] || 0) + (recordType === "income" ? +amount : -amount);
      return a;
    }, {});
    let cumulativeAmount = 0;
    return fullMonthList.current.map((month) => {
      cumulativeAmount += binnedData[month] || 0;
      return { date: new Date(month), amount: cumulativeAmount };
    });
  }, [data, fullMonthList]);

  let processedData;
  if (chartType === "cumulative") {
    processedData = cumulativeData;
    const startDateIndex = fullMonthList.current.indexOf(monthList[0]);
    const endDateIndex = fullMonthList.current.indexOf(monthList.at(-1)) + 1;
    processedData = processedData.slice(startDateIndex, endDateIndex);
  } else {
    const binnedData = filteredData.reduce((a, c) => {
      const { recordType, date, amount } = c;
      const key = date.substring(0, 7);
      a[key] = (a[key] || 0) + (recordType === "income" ? +amount : -amount);
      return a;
    }, {});
    processedData = monthList.map((month) => ({
      date: new Date(month),
      amount: binnedData[month] || 0,
    }));
  }

  const xScale = scaleTime()
    .domain(timeDomain.map((date) => new Date(date)))
    .range([margin.left, svgWidth - margin.right]);
  let yDomain = extent(processedData, (data) => data.amount);
  if (yDomain[0] > 0) {
    yDomain[0] = 0;
  }
  const yScale = scaleLinear()
    .domain(yDomain)
    .range([svgHeight - margin.bottom, margin.top])
    .nice();
  const path = line()
    .x((data) => xScale(data.date))
    .y((data) => yScale(data.amount));

  return (
    <>
      <h4>Net Income or Expenses Over Time</h4>
      <h6>Date: </h6>
      <div className="filter-container">
        <div className="single-filter">
          <label htmlFor="income-vs-expenses-filter-start-date">From:</label>
          <input
            type="date"
            name="startDate"
            className="input-style-bottom"
            id="income-vs-expenses-filter-start-date"
            onChange={filterHandle}
            max={today}
          />
        </div>
        <div className="single-filter">
          <label htmlFor="income-vs-expenses-filter-end-date">To:</label>
          <input
            type="date"
            name="endDate"
            className="input-style-bottom"
            id="income-vs-expenses-filter-end-date"
            max={today}
            onChange={filterHandle}
          />
        </div>
      </div>
      <div className="new-worth-over-time-chart">
        {filteredData.length > 0 ? (
          <>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              <line
                className="x-axis"
                x1={margin.left - tickHeight}
                x2={svgWidth - margin.right}
                y1={svgHeight - margin.bottom}
                y2={svgHeight - margin.bottom}
              />
              {monthList.map((date, index) => {
                const year = date.substring(0, 4);
                const month = monthLookup[+date.substring(5)].substring(0, 3);
                return (
                  <g
                    transform={`translate(${xScale(new Date(date))},${
                      svgHeight - margin.bottom / 2
                    })`}
                    key={`x-tick${index}`}
                    className="single-x-tick"
                  >
                    <line
                      className="tick"
                      y1={-margin.bottom / 2}
                      y2={-margin.bottom / 2 + tickHeight}
                    />
                    <text fontSize={tickTextSize} className="month">
                      {month}
                    </text>
                    <text
                      transform={`translate(0,${tickTextSize + 2})`}
                      fontSize={tickTextSize}
                      className="year"
                    >
                      {year}
                    </text>
                  </g>
                );
              })}
              <line
                className="y-axis"
                x1={margin.left}
                x2={margin.left}
                y1={svgHeight - margin.bottom + tickHeight}
                y2={margin.top}
              />
              {yScale.ticks().map((tick, index) => {
                return (
                  <g
                    transform={`translate(${margin.left},${yScale(tick)})`}
                    key={`y-tick${index}`}
                    className="single-y-tick"
                  >
                    <line
                      className="grid"
                      x2={svgWidth - margin.right - margin.left}
                    />
                    <line className="tick" x2={-tickHeight} />
                    <text x={-tickHeight - 4} fontSize={tickTextSize}>
                      {tick}
                    </text>
                  </g>
                );
              })}
              <path
                d={path(processedData)}
                className="net-income-expenses-path"
                fill="none"
              />
              {processedData.map((data, index) => {
                const month = data.date.toDateString().substring(4, 7);
                const year = data.date.toDateString().substring(11);
                return (
                  <circle
                    className={`${
                      chartType === "cumulative" ? "" : "non-"
                    }cumulative-circle`}
                    key={`data-c-${index}`}
                    cx={xScale(data.date)}
                    cy={yScale(data.amount)}
                    r={circleR}
                    onMouseMove={(e) => {
                      const { pageX, pageY } = e;
                      setTooltipValue({
                        date: `${month} ${year}`,
                        amount: data.amount,
                        x: pageX - 20,
                        y: pageY + 20,
                      });
                    }}
                    onMouseLeave={() => setTooltipValue("")}
                  />
                );
              })}
            </svg>
            <div className="legend">
              <h5>Chart Type</h5>
              <div
                className={`single-legend click-legend ${
                  chartType === "cumulative" && "clicked"
                }`}
                onClick={() => setChartType("cumulative")}
              >
                <span className="legend-cumulative"></span>
                <span>cumulative</span>
              </div>
              <div
                className={`single-legend click-legend ${
                  chartType === "nonCumulative" && "clicked"
                }`}
                onClick={() => setChartType("nonCumulative")}
              >
                <span className="legend-non-cumulative"></span>
                <span>non-cumulative</span>
              </div>
            </div>
            {tooltipValue && (
              <div
                className="tooltip"
                style={{ top: tooltipValue.y, left: tooltipValue.x }}
              >
                <h5>{tooltipValue.date}</h5>
                <p>{tooltipValue.amount}</p>
              </div>
            )}
          </>
        ) : (
          <div className="no-record">
            No income or expenses record in the given period
          </div>
        )}
      </div>
    </>
  );
}

export default NetWorthOverTime;