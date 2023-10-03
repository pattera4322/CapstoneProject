import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { NavLink } from "react-router-dom";
import "../index.css";
import SelectColumn from "../pages/SelectColumn.js";

const FileUploader = ({ handleFile }) => {
  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  //------------------------------------------------

  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  // submit state
  const [excelData, setExcelData] = useState(null);

  //------------------------------------------------

  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
    // ------------------------------------------------------------------------------
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (event) => {
          setExcelFile(event.target.result);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };

  // submit event
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0, 10));
    }
  };

  return (
    <>
      <form onSubmit={handleFileSubmit}>
        <button
          class="text-3xl absolute -mt-60 -ml-36 hover:bg-orange-100 text-black border-2 border-black rounded-full px-10 py-4"
          onClick={handleClick}
          onChange={handleFile}
        >
          Import Dataset
        </button>
        <input
          type="file"
          onChange={handleChange}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          ref={hiddenFileInput}
          style={{ display: "none" }} // Make the file input element invisible
        />
        <p></p>
        <button
          type="submit"
          class="text-3xl mt-20 hover:bg-orange-100 text-black border-2 border-black rounded-full px-10 py-4"
        >
          UPLOAD
        </button>
        {typeError && (
          <div className="alert alert-danger" role="alert">
            {typeError}
          </div>
        )}
      </form>

      {/* view data */}
      <div className="viewer">
        {excelData ? (
          <div class="relative overflow-x-auto m-24">
            <p className="text-left text-2xl mb-6">Example data :</p>
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-[#CAA37C] text-white">
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th scope="col" class="px-6 py-3" key={key}>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {excelData.map((individualExcelData, index) => (
                  <tr class="bg-white border-b text-black" key={index}>
                    {Object.keys(individualExcelData).map((key) => (
                      <td class="px-6 py-4" key={key}>
                        {individualExcelData[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <NavLink to="/SelectColumn">
              <button class="text-3xl mt-20 hover:bg-orange-100 text-black border-2 border-black rounded-full px-10 py-4">
                Next
              </button>
            </NavLink>
          </div>
        ) : (
          <div className="text-2xl mt-3">Support .xlsx and .csv</div>
        )}
      </div>
    </>
  );
};

export default FileUploader;
