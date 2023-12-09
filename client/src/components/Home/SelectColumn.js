import { useRef, useState, useEffect } from "react";

const ColumnSelect = (header) => {
  const [selectedColumns, setSelectedColumns] = useState({});

  useEffect(() => {
    localStorage.setItem("headerItems", JSON.stringify(selectedColumns));
  }, [selectedColumns]);

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setSelectedColumns((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [name]: value,
    }));
  };

  //-------------------------------------------------------------------------------------------------

  const LoopSelectOption = (columnName, key) => {
    const selectedOption = selectedColumns[key];

    const handleReset = () => {
      setSelectedColumns((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        [key]: "",
      }));
    };

    return (
      <div className="ml-24 mb-4 text-left" key={key}>
        <div
          style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}
        >
          {columnName} :
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <select
            className={`
            border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow 
            focus:outline-none focus:shadow-outline cursor-pointer
            ${selectedOption ? 'appearance-none' : ''} ${selectedOption ? '' : ''}`
          }
            onChange={handleSelectChange}
            name={key}
            value={selectedOption || ""}
            disabled={!!selectedOption}
          >
            <option value="" disabled>
              Select an option
            </option>
            {Object.keys(header.header).map((header, index) => (
              <option
                key={index}
                value={header}
                disabled={Object.values(selectedColumns).includes(header)}
              >
                {header}
              </option>
            ))}
          </select>
          {/* To reset selected*/}
          {selectedOption && (
            <div>
              <button onClick={handleReset}>
                <img
                  src={process.env.PUBLIC_URL + "/assets/resetIcon.svg"}
                  className="h-4 ml-2"
                  alt="resetIcon"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-1/2 h-92 float-right overflow-auto">
      <div className="items-left">
        {LoopSelectOption("Date", "date")}
        {/* TODO: make it optional in future */}
        {/* {LoopSelectOption("Year", "year")}
        {LoopSelectOption("Month", "month")} */}
        {LoopSelectOption("Product name/Category", "prodName")}
        {LoopSelectOption("Price Per unit", "price")}
        {LoopSelectOption("Quantity", "quantity")}
        {LoopSelectOption("Total Sales", "sales")}
        {/*<------------------------------------------ For developer ---------------------------------------> */}
        {process.env.NODE_ENV == "development" && (
          <div>
            <p>----------------Dev mode---------------</p>
            {Object.entries(selectedColumns).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColumnSelect;
