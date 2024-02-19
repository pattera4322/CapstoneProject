import { useState, useEffect } from "react";
import { Tabs, TabsHeader, TabsBody, Tab } from "@material-tailwind/react";
import FileUpload from "./FileUploader";
import { getFile } from "../../api/fileApi";
import * as XLSX from "xlsx";
import { deleteFile } from "../../api/fileApi";
import { getUserData } from "../../api/userDataApi";
import Swal from "sweetalert2";
import {showNetworkErrorAlert} from "../../utils/SwalAlert"

const SelectData = ({ sendfileData }) => {
  const [fileData, setFileData] = useState([]);
  const [isHasFile, setIsHasFile] = useState(false);
  const [isConfirmClicked, setIsConfirmClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filesInLocal, setFilesInLocal] = useState(
    JSON.parse(localStorage.getItem("files")) || {}
  );
  const [fileName, setFileName] = useState(
    JSON.parse(localStorage.getItem("fileName"))
  );

  const [activeTab, setActiveTab] = useState(1);
  const data = [
    {
      label: fileName && fileName[1] ? fileName[1] : "EMPTY",
      value: 1,
    },
    {
      label: fileName && fileName[2] ? fileName[2] : "EMPTY",
      value: 2,
    },
    {
      label: fileName && fileName[3] ? fileName[3] : "EMPTY",
      value: 3,
    },
    {
      label: fileName && fileName[4] ? fileName[4] : "EMPTY",
      value: 4,
    },
    {
      label: fileName && fileName[5] ? fileName[5] : "EMPTY",
      value: 5,
    },
  ];
  useEffect(() => {
    getUserData()
      .then((res) => {
        console.log(fileName);
        if (fileName === undefined || fileName === null) {
          if (res.data.userData.fileName === undefined) {
            localStorage.setItem("fileName", JSON.stringify({}));
            setFileName(JSON.parse(localStorage.getItem("fileName")));
          } else {
            localStorage.setItem(
              "fileName",
              JSON.stringify(res.data.userData.fileName)
            );
            setFileName(JSON.parse(localStorage.getItem("fileName")));
          }
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.message === "Network Error") {
          showNetworkErrorAlert();
        }
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    if (filesInLocal[activeTab] !== undefined) {
      setLoading(false);
      // Get preview file from local...
      const data = filesInLocal[activeTab];
      setIsHasFile(true);
      sendfileData(data, activeTab);
      setFileData(data);
    } else {
      getFile(activeTab)
        .then((data) => {
          setLoading(false);
          if (data) {
            sendfileData(data, activeTab);
            setIsHasFile(true);
            convertFileXLSX(data);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            console.log("File Not found");
          } else if (error.message === "Network Error") {
            showNetworkErrorAlert();
          } else {
            console.log("Error fetching file: ", error);
          }
          setIsHasFile(false);
          setFileData([]);
          sendfileData(null, activeTab);
          setLoading(false);
        });
    }
  }, [activeTab, isConfirmClicked]);

  const convertFileXLSX = (data) => {
    const workbook = XLSX.read(data, { type: "buffer", cellDates: true });

    const firstSheet = workbook.SheetNames[0];
    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
    const excelDataSlice = excelData.slice(0, 10);
    savePreviewFileToLocalStorage(excelDataSlice);
    setFileData(excelDataSlice);
  };

  const savePreviewFileToLocalStorage = (fileContent) => {
    const fileHistory = JSON.parse(localStorage.getItem("files")) || {};

    const fileToLocalStorage = {
      ...fileHistory,
      [activeTab]: fileContent,
    };
    localStorage.setItem("files", JSON.stringify(fileToLocalStorage));
    setFilesInLocal(fileToLocalStorage);
  };

  const removeSelectedFile = async () => {
    Swal.showLoading();
    await deleteFile(activeTab)
      .then(() => {
        delete filesInLocal[activeTab];
        delete fileName[activeTab];
        localStorage.setItem("files", JSON.stringify(filesInLocal));
        localStorage.setItem("fileName", JSON.stringify(fileName));
        setFileData([]);
        setIsHasFile(false);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "The file has been reomoved!",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Not have this file in storage",
            text: "Something went wrong!",
          });
        }else if (error.message === "Network Error") {
          showNetworkErrorAlert();
        } else {
          console.error("Error deleting file:", error);
        }
      });
  };

  return (
    <div className="pt-10">
      <div className="pb-20 text-gray-500">
        Welcome to the 'Import Data' step. Here, you can effortlessly bring your
        data into our system and configure the columns for analysis.
      </div>
      <Tabs value={activeTab}>
        <TabsHeader
          className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
          indicatorProps={{
            className:
              "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
          }}
        >
          {data.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => {
                setActiveTab(value);
                setIsConfirmClicked(false);
              }}
              className={activeTab === value ? "text-gray-900" : ""}
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          <FileUpload
            index={activeTab}
            content={fileData}
            isFileUploaded={isHasFile}
            loading={loading}
            onConfirmButtonClick={() => {
              setIsConfirmClicked(true);
              setFileName(JSON.parse(localStorage.getItem("fileName")));
            }}
            removeSelectedFile={removeSelectedFile}
          />
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default SelectData;
