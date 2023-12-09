import React, { useContext, useState, useEffect } from "react";
import moment from 'moment';
import { Button } from "@material-tailwind/react";
import * as XLSX from "xlsx";
import { postFile } from "../../api/fileApi";
import PropagateLoader from "react-spinners/PropagateLoader";
import ColumnSelect from "./SelectColumn";
import Popup from "../Popup.js";


const FileUpload = ({
  index,
  content,
  isFileUploaded,
  loading,
  onConfirmButtonClick,
  removeSelectedFile,
}) => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isHasFile, setIsHasFile] = useState(false);

  const override = {
    display: "block",
    position: "absolute",
    top: "50%",
    left: "50%",
  };

  useEffect(() => {
    console.log(`Is file uploaded: `, isFileUploaded);
    if (isFileUploaded) {
      setData(content);
      setIsHasFile(true);
      console.log(`Finish set Data`);
    } else {
      setData([]);
      setIsHasFile(false);
      setSelectedFileName(null);
    }
  }, [content]);

  const convertFileXLSX = (data) => {
    const workbook = XLSX.read(data, { type: "buffer", cellDates: true });
    const firstSheet = workbook.SheetNames[0];
    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
    console.log(`Finish converting file`);
    return excelData;
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleConfirm = async () => {
    try {
      const userId = "user1";

      const formData = new FormData();
      formData.append("file", file);
      console.log(formData.get("file"));

      const data = await postFile(userId, index, formData);
      console.log("Data:", data);

      onConfirmButtonClick();
      setIsHasFile(true);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFiles = (files) => {
    const file = files[0];
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (file) {
      if (!fileTypes.includes(file.type)) {
        setError("Invalid file type. Please select a CSV or Excel file.");
        return;
      }
      setFile(file);
      setError("");
      setSelectedFileName(file.name);

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const fileData = e.target.result;
        const excelData = convertFileXLSX(fileData);
        console.log(excelData.slice(0, 10));
        setData(excelData.slice(0, 10));
      };
    }
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  return (
    <div className="mt-8">
      {/* <------------------------------- Loading section --------------------------------> */}
      {loading && (
        <div className="mt-8 mb-48">
          <PropagateLoader
            color="#F1D1AB"
            loading={loading}
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      {!loading && (
        <div>
          {!isHasFile && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-dashed rounded-3xl border-4 py-32 px-4 ${
                isDragging ? "bg-gray-200" : "bg-white"
              }`}
            >
              <label htmlFor="fileInput" className="cursor-pointer">
                {isDragging
                  ? "Drop the file here"
                  : "Select a file or drop it here"}
              </label>

              {selectedFileName && <p>Selected File: {selectedFileName}</p>}
              {error && <p className="text-red-600">{error}</p>}
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="fileInput"
              />
            </div>
          )}

          {/* <------------------------------- Preview data section --------------------------------> */}
          {data[0] && (
            <div>
              <div className="py-8 text-left">
                <span style={{ display: "flex", alignItems: "center" }}>
                  Preview data
                  {isHasFile ? (
                    <div className="ml-auto">
                      {/* <button onClick={removeSelectedFile}> */}
                      <button onClick={handleButtonClick}>
                        <img
                          src={
                            process.env.PUBLIC_URL + "/assets/deleteIcon.svg"
                          }
                          className="h-8 mr-2 sm:mr-4"
                          alt="deleteIcon"
                        />
                      </button>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </span>
              </div>
              <div className="w-1/2 h-96 overflow-auto float-left">
                <table className="w-full text-m text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-[#F1D1AB]">
                    <tr>
                      {data[0] &&
                        Object.keys(data[0]).map((header, index) => (
                          <th className="pr-12" key={index}>
                            {header}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex}>
                            {cell instanceof Date
                              ? moment(cell.toLocaleDateString()).format('MM/DD/YYYY')
                              : cell}
                          </td>
                          // <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* <------------------------------- Upload data section --------------------------------> */}

              {data[0] && !isHasFile ? (
                <div className="w-1/2 h-96 float-right">
                  <Button onClick={handleConfirm}>
                    Confirm to use this data
                  </Button>
                </div>
              ) : (
                <ColumnSelect header={data[0]} />
              )}
            </div>
          )}
        </div>
      )}

      {/* Popup component */}
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          header={"Are you sure?"}
          info={
            " Do you want to delete this file? This file cannot be restored."
          }
          onContinue={() => {
            removeSelectedFile("delete");
            setShowPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default FileUpload;
