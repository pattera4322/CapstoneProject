import { useRef, useState, useEffect } from "react";

const ColumnSelect = (header) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selected, setSelected] = useState([]);

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [name]: value,
    }));
    setSelected((prevSelected) => [...prevSelected])
  };

  const LoopSelectOption = (columnName, key) => {
    const selectedOption = selectedOptions[key];
    return (
      <div className="m-2" key={key}>
        {columnName} :
        <select
          className="appearance-none ml-2 w-52 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleSelectChange}
          name={key}
          value={selectedOption || ''}
        >
          <option value="" disabled>
            Select an option
          </option>
          {Object.keys(header.header).map((header, index) => (
            <option key={index} value={header} disabled={null}>
              {header}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="w-1/2 h-96 float-right overflow-auto">
      <div className="m-2  items-left">
        {LoopSelectOption("Date", "date")}
        {LoopSelectOption("Product name/Category", "prodName")}
        {LoopSelectOption("Price Per unit", "price")}
        {LoopSelectOption("Quantity", "quantity")}
        {LoopSelectOption("Total Sales", "sales")}
        {Object.entries(selectedOptions).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value}
        </div>
      ))}
      </div>
    </div>
  );
};

export default ColumnSelect;
