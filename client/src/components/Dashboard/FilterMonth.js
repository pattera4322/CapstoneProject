import React, { useState, useEffect } from "react";

const FilterMonth = ({ months, onRangeChange }) => {
  // const [rangeValue, setRangeValue] = useState(months);

  // useEffect(() => {
  //   setRangeValue(months);
  // }, [months]);

  // const handleOnChange = (e) => {
  //   setRangeValue(parseInt(e.target.value));
  //   onRangeChange(parseInt(e.target.value));
  // };

  const [selectedMonth, setSelectedMonth] = useState("Select Month");

  useEffect(() => {
    setSelectedMonth("Select Month");
  }, []);

  const handleOnChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    setSelectedMonth(selectedValue);
    onRangeChange(selectedValue);
  };

  return (
    // <div>
    //   <label htmlFor="numberRange">Filter Actual Months: </label>
    //   <input
    //     type="range"
    //     id="numberRange"
    //     name="numberRange"
    //     value={rangeValue}
    //     min={0}
    //     max={months}
    //     step={3}
    //     onChange={handleOnChange}
    //     class="block w-full text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
    //   />
    //   <span> {rangeValue} months</span>
    //   <ul></ul>
    // </div>
    <div>
      <select
        id="monthDropdown"
        name="monthDropdown"
        value={selectedMonth}
        onChange={handleOnChange}
        className="block w-32 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring text-black text-sm text-gray-700 dark:text-gray-200"
      >
        <option value="Select Month">Select Month</option>
        {Array.from({ length: months / 3 }, (_, index) => (
          <option key={index} value={(index + 1) * 3}>
            {(index + 1) * 3} months
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterMonth;
