import { useContext, useState, useEffect } from "react";
import { Tabs, TabsHeader, TabsBody, Tab } from "@material-tailwind/react";
import FileUpload from "./FileUploader";
import { getFile } from "../../api/fileApi";
import * as XLSX from "xlsx";
import { deleteFile } from "../../api/fileApi";

const SelectData = ({ sendfileData }) => {
  const [fileData, setFileData] = useState([]);
  const [isHasFile, setIsHasFile] = useState(false);
  const [isConfirmClicked, setIsConfirmClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filesInLocal, setFilesInLocal] = useState(
    JSON.parse(localStorage.getItem("files")) || {}
  );

  const [activeTab, setActiveTab] = useState(1);
  const data = [
    //TODO: - change to file name
    {
      label: "SLOT 1",
      value: 1,
    },
    {
      label: "SLOT 2",
      value: 2,
    },
    {
      label: "SLOT 3",
      value: 3,
    },
    {
      label: "SLOT 4",
      value: 4,
    },
    {
      label: "SLOT 5",
      value: 5,
    },
  ];

  useEffect(() => {
    const userId = "user1";
    setLoading(true);
    if (filesInLocal[activeTab] != undefined) {
      setLoading(false);
      console.log("Get preview file from local...");
      const data = filesInLocal[activeTab];
      setIsHasFile(true);
      sendfileData(data, activeTab);
      setFileData(data);
    } else {
      getFile(userId, activeTab)
        .then((data) => {
          setLoading(false);
          if (data) {
            console.log("Data:", data);
            sendfileData(data, activeTab);
            setIsHasFile(true);
            convertFileXLSX(data);
          } else {
            setIsHasFile(false);
            setFileData([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching file: ", error);
          setLoading(false);
        });
    }
  }, [activeTab, isConfirmClicked]);

  const convertFileXLSX = (data) => {
    const workbook = XLSX.read(data, { type: "buffer", cellDates: true });

    const firstSheet = workbook.SheetNames[0];
    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
    console.log(`Finish converting file`);
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

  const removeSelectedFile = () => {
    delete filesInLocal[activeTab];
    localStorage.setItem("files", JSON.stringify(filesInLocal));
    deleteFile("user1",activeTab);
    setFileData([]);
    setIsHasFile(false);
    //TODO: - handle userid in local storage
    //-handle popup ask user before delete
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
            onConfirmButtonClick={() => setIsConfirmClicked(true)}
            removeSelectedFile={removeSelectedFile}
          />
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default SelectData;
