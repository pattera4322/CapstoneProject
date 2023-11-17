import { useRef, useState, useEffect } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import FileUpload from "./FileUpload";
import { getFile } from "../../api/fileApi";
import * as XLSX from "xlsx";

const SelectData = ({}) => {
  const [fileData, setFileData] = useState([]);
  const [isHasFile, setIsHasFile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slotName, setSlotName] = useState(["EMPTY SLOT", "FILE "]);

  const [activeTab, setActiveTab] = useState(1);
  const data = [
    {
      label: isHasFile ? `${slotName[1]} 1` : slotName[0],
      value: 1,
    },
    {
      label: isHasFile ? `${slotName[1]} 2` : slotName[0],
      value: 2,
    },
    {
      label: isHasFile ? `${slotName[1]} 3` : slotName[0],
      value: 3,
    },
    {
      label: isHasFile ? `${slotName[1]} 4` : slotName[0],
      value: 4,
    },
    {
      label: isHasFile ? `${slotName[1]} 5` : slotName[0],
      value: 5,
    },
  ];

  useEffect(() => {
    const userId = 'user1';
    setLoading(true)
    getFile(userId, activeTab)
      .then((data) => {
        setLoading(false)
        if (data) {
          console.log('Data:', data);
          setIsHasFile(true);
          convertFileXLSX(data)
        } else {
          setIsHasFile(false);
          setFileData([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching file: ', error);
        setLoading(false)
      });
  }, [activeTab]);

  const convertFileXLSX = (data) => {
    const workbook = XLSX.read(data, { type: "buffer" });

    const firstSheet = workbook.SheetNames[0];
    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
    console.log(`Finish converting file`);
    setFileData(excelData);
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
              onClick={() => setActiveTab(value)}
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
            />
    
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default SelectData;
// {data.map(({ value, desc }) => (
//   <TabPanel key={value} value={value}>
//     {/* {desc} */}
//     <FileUpload index={value} content={fileData} isFileUploaded={isHasFile} />
//   </TabPanel>
// ))}
