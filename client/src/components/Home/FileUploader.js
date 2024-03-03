import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import * as XLSX from "xlsx";
import { postFile } from "../../api/fileApi";
import PropagateLoader from "react-spinners/PropagateLoader";
import ProgressBar from "../ProgressBar.js";
import Popup from "../Popup.js";
import Swal from "sweetalert2";
import {showNetworkErrorAlert} from "../../utils/SwalAlert"

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
  const [loadingDropFile, setLoadingDropFile] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("fileName"))
  );

  const override = {
    display: "block",
    position: "absolute",
    top: "50%",
    left: "50%",
  };

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("fileName")));
    if (isFileUploaded) {
      setData(content);
      setIsHasFile(true);
    } else {
      setData([]);
      setIsHasFile(false);
      setSelectedFileName(null);
    }
  }, [content]);

  useEffect(() => {
    setError("");
  }, [index]);

  const convertFileXLSX = (data) => {
    const workbook = XLSX.read(data, { type: "buffer", cellDates: true });
    const firstSheet = workbook.SheetNames[0];
    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
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

  const [progress, setProgress] = useState(0);
  const handleConfirm = async () => {
    try {
      setShowProgress(true);

      const formData = new FormData();
      formData.append("file", file);

      await postFile(index, formData, (progressEvent) => {
        const progressPercentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(progressPercentage);
      });

      updateFileName();
      onConfirmButtonClick();
      setIsHasFile(true);
      setShowProgress(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error.message === "Network Error") {
        showNetworkErrorAlert();
      }else{
        Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Error uploading file!",
      });
      }
    }
  };

  const updateFileName = () => {
    const updatedUserData = {
      ...userData,
      [index]: selectedFileName,
    };
    setUserData(updatedUserData);
    localStorage.setItem("fileName", JSON.stringify(updatedUserData));
  };

  const handleFiles = (files) => {
    const file = files[0];
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (file) {
      setLoadingDropFile(true);
      if (!fileTypes.includes(file.type)) {
        setLoadingDropFile(false);
        setSelectedFileName(file.name);
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
        if (excelData.length === 0) {
          setError(
            "This file is empty. Please insert some data before uploading it. Thank you!"
          );
        }
        setData(excelData.slice(0, 10));
        setLoadingDropFile(false);
      };
    }
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setFile(null);
    setSelectedFileName("");
    setShowProgress(false);
    setData([]); // Clear the data when cancelling
  };

  function formatDateString(cell) {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if(regex.test(cell)){
       const date = new Date(cell);
    
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    
    return formattedDate;
    }
   return cell;
  }

  return (
    <div className="mt-8">
      {/* <------------------------------- Loading section --------------------------------> */}
      {loading && (
        <div className="mt-8 mb-48">
          <PropagateLoader
            color="#0068D2"
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
              {/* TODO: improve later */}
              {true && (
                <label
                  htmlFor="fileInput"
                  className={`cursor-pointer opacity-100 transition-opacity duration-1000 text-gray-400`}
                >
                  {isDragging
                    ? "Drop the file here"
                    : "Select a file or drop it here"}
                  {selectedFileName && <p className="text-gray-800">Selected File: {selectedFileName}</p>}
                  {error && <p className="text-red-600">{error}</p>}
                </label>
              )}

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
          {loadingDropFile && (
            <div className="mt-8 mb-48">
              <PropagateLoader
                color="#F1D1AB"
                loading={loadingDropFile}
                cssOverride={override}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          )}
          {data[0] && error === "" ? (
            <div>
              <div className="py-8">
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
              <div className="w-full overflow-auto">
                <table className="w-full text-m text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-left text-white uppercase bg-[#0068D2]">
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
                              ? cell.toLocaleDateString()
                              : formatDateString(cell) }
                          </td>
                          // <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* <------------------------------- Upload data section --------------------------------> */}

              {/* data[0] &&  */}

              {
                !isHasFile ? (
                  <div className="w-full pt-8">
                    <Button
                      onClick={() => {
                        handleConfirm();
                      }}
                      className="bg-[#0068D2] text-white"
                    >
                      Confirm to use this data
                    </Button>
                    <Button
                      className="ml-2 bg-gray-300 text-black"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <ProgressBar
                      showProgress={showProgress}
                      progress={progress}
                      text={"Uploading..."}
                    />
                  </div>
                ) : null
                // (
                //   <ColumnSelect header={data[0]} />
                // )
              }
            </div>
          ) : null}
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
