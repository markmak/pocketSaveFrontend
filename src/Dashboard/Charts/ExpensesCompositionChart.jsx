import React, { useState } from "react";
import { scaleOrdinal, pie, arc } from "d3";
import { monthLookup, expenseTypes, expenseColorList } from "../../lookup";

const svgWidth = 250;
const svgHeight = 250;
const innerR = 50;
const outerR = 100;
const cornerR = 2;
const lineHeight = 10;

const pieData = pie();
const arcPath = arc()
  .innerRadius(innerR)
  .outerRadius(outerR)
  .cornerRadius(cornerR);

const color = scaleOrdinal().domain(expenseTypes).range(expenseColorList);

function ExpensesCompositionChart({ data }) {
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth() + 1;
  const [filter, setFilter] = useState({
    year: thisYear,
    month: thisMonth,
  });
  const [hoverCategory, setHoverCategory] = useState("");
  const [tooltipValue, setTooltipValue] = useState("");

  const filterHandle = (e) => {
    const name = e.currentTarget.name;
    const value = +e.currentTarget.value;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData = data.filter((data) => {
    return (
      +data.date.substring(0, 4) === filter.year &&
      +data.date.substring(5, 7) === filter.month
    );
  });
  let processedData = filteredData.reduce((a, c) => {
    a[c.type] = a[c.type] ? a[c.type] + c.amount : c.amount;
    return a;
  }, {});
  processedData = Object.keys(processedData)
    .map((key) => {
      return { category: key, amount: processedData[key] };
    })
    .sort((a, b) => a.amount - b.amount);

  return (
    <>
      <h4 id="expenses-composition-h4">Monthly Expenses Composition</h4>
      <div className="filter-container">
        <div className="single-filter">
          <label htmlFor="expenses-composition-filter-year">Year: </label>
          <input
            type="number"
            min="2000"
            max={thisYear}
            name="year"
            className="input-style-bottom"
            id="expenses-composition-filter-year"
            value={filter.year}
            onChange={filterHandle}
          />
        </div>
        <div className="single-filter">
          <label htmlFor="expenses-composition-filter-month">Month: </label>
          <input
            type="number"
            min="1"
            max="12"
            name="month"
            className="input-style-bottom"
            id="expenses-composition-filter-month"
            value={filter.month}
            onChange={filterHandle}
          />
        </div>
      </div>
      <div className="expenses-pie-chart">
        {filteredData.length > 0 ? (
          <>
            <svg
              viewBox={`${-svgWidth / 2} ${
                -svgHeight / 2
              } ${svgWidth} ${svgHeight}`}
            >
              {pieData(processedData.map((data) => data.amount)).map(
                (data, index) => {
                  const { value, startAngle, endAngle } = data;
                  const category = processedData[index].category;
                  return (
                    <path
                      key={`arc${index}`}
                      fill={color(category)}
                      d={arcPath.startAngle(startAngle).endAngle(endAngle)()}
                      className="arc"
                      style={{
                        opacity: `${
                          !hoverCategory || hoverCategory === category ? 1 : 0.2
                        }`,
                        stroke: `${
                          hoverCategory === category ||
                          tooltipValue.category === category
                            ? "white"
                            : ""
                        }`,
                      }}
                      onMouseMove={(e) => {
                        const { pageX, pageY } = e;
                        setTooltipValue({
                          category: category,
                          amount: value,
                          x: pageX,
                          y: pageY + 25,
                        });
                      }}
                      onMouseLeave={() => {
                        setTooltipValue("");
                      }}
                    />
                  );
                }
              )}
              <text transform={`translate(0,${-lineHeight})`}>Total:</text>
              <text transform={`translate(0,${lineHeight})`}>
                {processedData.reduce((a, c) => a + c.amount, 0)}
              </text>
            </svg>
            <div
              className="legend"
              onMouseLeave={() => {
                setTooltipValue("");
                setHoverCategory("");
              }}
            >
              <h5>Expenses Type</h5>
              {processedData.map((data, index) => (
                <div
                  key={`expenesCompositionLegend${index}`}
                  className="single-legend"
                  onMouseEnter={() => {
                    setHoverCategory(data.category);
                    setTooltipValue(() => {
                      const title = document.getElementById(
                        "expenses-composition-h4"
                      );
                      const x = title.offsetLeft;
                      const y = title.offsetTop + 60;
                      return {
                        category: data.category,
                        amount: data.amount,
                        x,
                        y,
                      };
                    });
                  }}
                >
                  <span
                    style={{ backgroundColor: `${color(data.category)}` }}
                  ></span>
                  <span>{data.category}</span>
                </div>
              ))}
            </div>
            {tooltipValue && (
              <div
                className="tooltip"
                style={{ top: tooltipValue.y, left: tooltipValue.x }}
              >
                <h5>{tooltipValue.category}</h5>
                <p>{tooltipValue.amount}</p>
              </div>
            )}
          </>
        ) : (
          <div className="no-record">
            No expenses record in {monthLookup[filter.month]} {filter.year}
          </div>
        )}
      </div>
    </>
  );
}

export default ExpensesCompositionChart;
