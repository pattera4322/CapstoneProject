import React, { useEffect, useState } from "react";
import { socketJobProgress } from "../config/socketClient";
import { getQueues } from "../api/analyzeApi";
import JobComponent from "../components/History/JobComponent";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import ButtonComponent from "../components/Button/Button";
import Badge from "../components/Badge";
import { useProgress } from "../context/ProgressContext";
import { getUserHistories } from "../api/userHistoryApi";
import LoadingPage from "../components/LoadingPage";

const History = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);

  const [completedAnalyzed, setCompletedAnalyzed] = useState([]);
  const [queuesData, setQueuesData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  // const [completedArray, setCompletedArray] = useState([]);
  // const [errorArray, setErrorArray] = useState([]);

  const { progressData, setProgressData } = useProgress();
  const [isStart, setIsStart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [text, setText] = useState("");
  const [clickedTabs, setClickedTabs] = useState(
    Array.from({ length: activeTab }, () => false)
  );
  const userId = JSON.parse(localStorage.getItem("user"));
  const progressInLocal = JSON.parse(localStorage.getItem("progress"));
  const location = useLocation();
  socketJobProgress.connect();

  useEffect(() => {
    if (isStart === false) {
      setIsLoading(true);
      getQueues()
        .then((res) => {
          setQueuesData(res);
          console.log(res);
          if (!progressInLocal) {
            setProgressData(res[0]);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.response && error.response.status === 404) {
            setQueuesData([]);
          }
          console.log(error);
        });

      setIsLoading(true);
      getUserHistories()
        .then((res) => {
          setCompletedAnalyzed(res.data);
          console.log(res.data);
          setIsStart(true);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    }

    socketJobProgress.emit("authenticate", {
      userId: userId.uid,
      isFromClient: true,
    });

    const handleProgressFromServer = (data) => {
      console.log(data.progress);
      if (data.userid === userId.uid) {
        if (isStart) {
          setProgressData(data);
        }

        localStorage.setItem("progress", JSON.stringify(data));

        if (data.progress === 101) {
          setIsStart(false);
        }
      }
    };

    socketJobProgress.on("progressfromServer", handleProgressFromServer);

    return () => {
      socketJobProgress.off("progressfromServer", handleProgressFromServer);
    };
  }, [isStart]);

  useEffect(() => {
    // const filteredCompletedArray = completedAnalyzed.filter(
    //   (item) => item.errorMessage === undefined
    // );
    // const filteredErrorArray = completedAnalyzed.filter(
    //   (item) => item.errorMessage !== undefined
    // );
    // setCompletedArray(filteredCompletedArray);
    // setErrorArray(filteredErrorArray);
    switch (activeTab) {
      case 1:
        setFilteredJobs(queuesData);
        setText("Analyzing data in queue yet");
        break;
      case 2:
        setFilteredJobs(completedAnalyzed);
        setText("Completed data yet");
        break;
      // case 3:
      //   setFilteredJobs(filteredErrorArray);
      //   setText("failed data");
      //   break;
      default:
        setFilteredJobs(completedAnalyzed);
    }
  }, [completedAnalyzed, queuesData, activeTab]);

  const checkIsNewValue = (oldArray, newArray) => {
    const newElements = newArray.filter(
      (element) => !oldArray.includes(element)
    );
    return newElements.length > 0;
  };

  const onTabClick = (tab) => {
    setActiveTab(tab);
    const updatedClickedTabs = [...clickedTabs];
    updatedClickedTabs[tab] = true;
    setClickedTabs(updatedClickedTabs);
  };

  // const renderTab = (tabNumber, label) => (
  //   <li className="mr-6" key={tabNumber}>
  //     {!clickedTabs[tabNumber] && <Badge />}
  //     <button
  //       onClick={() => onTabClick(tabNumber)}
  //       className={`inline-block p-2 ${
  //         activeTab === tabNumber
  //           ? "text-black bg-[#F1D1AB] rounded-t-lg"
  //           : "rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
  //       }`}
  //     >
  //       {label}
  //     </button>
  //   </li>
  // );

  const renderTab = (tabNumber, label) => {
    let badge = null;
    // if (tabNumber === 2) {
    //   badge = checkIsNewValue()
    // } else if (tabNumber === 3) {
    //   badge = checkIsNewValue()
    // }

    return (
      <li className="mr-6" key={tabNumber}>
        <button
          onClick={() => onTabClick(tabNumber)}
          className={`relative inline-block p-2 ${activeTab === tabNumber
              ? "text-white bg-[#0068D2] rounded-t-lg"
              : "rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
        >
          {badge && (
            <span className="absolute top-0 right-0 mt-0 mr-0">
              <Badge />
            </span>
          )}
          {label}
        </button>
      </li>
    );
  };

  return (
    <div>
      <div><LoadingPage loading={isLoading} /></div>
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 pt-20 pr-8 pl-8">
        {renderTab(1, "On Analyzing")}
        {renderTab(2, "Analyzed Data")}
        {/* {renderTab(3, "Analyze Failed")} */}
      </ul>
      <div className="flex justify-end mx-16 mt-8">
        <div className="">
          <NavLink to="/">
            <ButtonComponent onClick={() => { }} children={"Analyze More"} />
          </NavLink>
        </div>
      </div>
      <div className={`grid grid-cols-2 gap-4 content-center`}>
        {filteredJobs.length > 0 ? (
          <div>
            {filteredJobs.map((job, index) => (
              <JobComponent
                index={index}
                job={job}
                progressData={progressData}
                userIdFromLocal={userId.uid}
              />
            ))}
          </div>
        ) : (
          <div className="m-32 text-gray-500">Do not have {text}</div>
        )}
        <img
          src={process.env.PUBLIC_URL + "/assets/SmartStockHistoryBG.svg"}
          alt="SmartStock Home Image"
          className="inset-0 mx-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
        />
      </div>
    </div>
  );
};

export default History;
