import React, { useState, useEffect } from "react";

const FilterMonth = ({ months, onRangeChange }) => {
  const [rangeValue, setRangeValue] = useState(months);

  useEffect(() => {
    setRangeValue(months);
  }, [months]);

  const handleOnChange = (e) => {
    setRangeValue(parseInt(e.target.value));
    onRangeChange(parseInt(e.target.value));
  };

  return (
    <div>
      <label htmlFor="numberRange">Filter Actual data Months: </label>
      <input
        type="range"
        id="numberRange"
        name="numberRange"
        value={rangeValue}
        min={0}
        max={months}
        step={3}
        onChange={handleOnChange}
      />
      <span> {rangeValue} months</span>
      <ul></ul>
    </div>
  );
};

export default FilterMonth;
