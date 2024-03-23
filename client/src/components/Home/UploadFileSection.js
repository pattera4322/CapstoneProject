import { useState, useEffect } from "react";
import { Tabs, TabsHeader, TabsBody, Tab } from "@material-tailwind/react";
import FileUpload from "./FileUploader";
import { getFile } from "../../api/fileApi";
import * as XLSX from "xlsx";
import { deleteFile } from "../../api/fileApi";
import { getUserData, updateUserData } from "../../api/userDataApi";
import { showSuccessAlert, showErrorAlert } from "../../utils/SwalAlert";
import LoadingPage from "../LoadingPage";

const SelectData = ({ sendfileData }) => {
  const [fileData, setFileData] = useState([]);
  const [isHasFile, setIsHasFile] = useState(false);
  const [isConfirmClicked, setIsConfirmClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showloadingPage, setShowLoadingPage] = useState(false);
  const [filesInLocal, setFilesInLocal] = useState(
    JSON.parse(localStorage.getItem("files")) || {}
  );
  const [fileName, setFileName] = useState(
    JSON.parse(localStorage.getItem("fileName")) 
  );

  var limitFromLocal = localStorage.getItem("analyzeLimit");
  const limit = ++limitFromLocal;

  const [activeTab, setActiveTab] = useState(1);
  const data = [
    {
      label: fileName && fileName[limit] ? fileName[limit] : "EMPTY",
      value: 1,
    }
  ];
  useEffect(() => {
    getUserData()
      .then((res) => {
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
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    if (filesInLocal[limit] !== undefined) {
      setLoading(false);
      // Get preview file from local...
      const data = filesInLocal[limit];
      setIsHasFile(true);
      sendfileData(data, limit);
      setFileData(data);
    } else {
      getFile(limit)
        .then((data) => {
          setLoading(false);
          if (data) {
            sendfileData(data, limit);
            setIsHasFile(true);
            convertFileXLSX(data);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            console.log("File Not found");
          } else {
            console.log("Error fetching file: ", error);
          }
          setIsHasFile(false);
          setFileData([]);
          sendfileData(null, limit);
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
      [limit]: fileContent,
    };
    localStorage.setItem("files", JSON.stringify(fileToLocalStorage));
    setFilesInLocal(fileToLocalStorage);
  };

  const removeSelectedFile = async () => {
    setShowLoadingPage(true);
    await deleteFile(limit)
      .then(async () => {
        delete filesInLocal[limit];
        delete fileName[limit];
        localStorage.setItem("files", JSON.stringify(filesInLocal));
        localStorage.setItem("fileName", JSON.stringify(fileName));
        setFileData([]);
        setIsHasFile(false);
        await updateUserData({ fileName: fileName }).catch((error) => {
          console.log("Error update file:", error);
        });
        setShowLoadingPage(false);
        await showSuccessAlert("The file has been removed!");
      })
      .catch((error) => {
        setShowLoadingPage(false);
        if (error.response && error.response.status === 404) {
          showErrorAlert("Not have this file in storage", "");
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

              {fileName && fileName[value] ? (
                <div>{label}</div>
              ) : (
                <div className="text-gray-500">EMPTY</div>
              )}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          <LoadingPage loading={showloadingPage} />
          <FileUpload
            index={limit}
            content={fileData}
            isFileUploaded={isHasFile}
            loading={loading}
            onConfirmButtonClick={() => {
              setFileName(JSON.parse(localStorage.getItem("fileName")));
              setIsConfirmClicked(true);
            }}
            removeSelectedFile={removeSelectedFile}
          />
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default SelectData;
