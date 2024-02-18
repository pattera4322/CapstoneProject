import React, { useEffect, useState } from "react";
import { socketJobProgress } from "../config/socketClient";
import { getQueues } from "../api/analyzeApi";
import JobComponent from "../components/History/JobComponent";
import { useLocation, NavLink } from "react-router-dom";
import ButtonComponent from "../components/Button";
import Badge from "../components/Badge";
import { useProgress } from "../context/ProgressContext";
import { getUserHistories } from "../api/userDataApi";
import {showNetworkErrorAlert} from "../utils/SwalAlert";

const History = () => {
  const [activeTab, setActiveTab] = useState(1);

  const [completedAnalyzed, setCompletedAnalyzed] = useState([]);
  const [queuesData, setQueuesData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const { progressData, setProgressData } = useProgress();

  const [text, setText] = useState("");
  const [clickedTabs, setClickedTabs] = useState(
    Array.from({ length: activeTab }, () => false)
  );
  const userId = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  socketJobProgress.connect();

  useEffect(() => {
    getQueues()
      .then((res) => {
        setQueuesData(res.data);
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          showNetworkErrorAlert();
        } else {
          console.log(error);
        }
      });

    getUserHistories()
      .then((res) => {
        setCompletedAnalyzed(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          showNetworkErrorAlert();
        } else {
          console.log(error);
        }
      });

    socketJobProgress.emit("authenticate", {
      userId: userId.uid,
      isFromClient: true,
    });

    socketJobProgress.on("progressfromServer", (data) => {
      console.log(data.progress);
      setProgressData(data);
      if (data.progress === 101) {
        getQueues()
          .then((res) => {
            setQueuesData(res.data);
            console.log("on 101:", res.data);
          })
          .catch((error) => {
            setQueuesData([]);
            console.log(error);
          });

        getUserHistories()
          .then((res) => {
            if (res) {
              setCompletedAnalyzed(res.data);
            }
          })
          .catch((error) => {
            setCompletedAnalyzed([]);
            console.log(error);
          });
      }
    });

    // return () => {
    //   socket.disconnect(); // Cleanup the socket connection on component unmount
    // };
  }, []);

  useEffect(() => {
    const filteredCompletedArray = completedAnalyzed.filter(
      (item) => item.errorMessage === undefined
    );
    const filteredErrorArray = completedAnalyzed.filter(
      (item) => item.errorMessage !== undefined
    );
    switch (activeTab) {
      case 1:
        setFilteredJobs(queuesData);
        setText("Analyzing data in queue yet");
        break;
      case 2:
        setFilteredJobs(filteredCompletedArray);
        setText("Completed data yet");
        break;
      case 3:
        setFilteredJobs(filteredErrorArray);
        setText("failed data");
        break;
      default:
        setFilteredJobs(completedAnalyzed);
    }
  }, [completedAnalyzed, queuesData, activeTab]);

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
    if (tabNumber === 2) {
      // Analyzed success tab
      badge = completedAnalyzed.some(
        (item) => item.errorMessage === undefined
      ) ? (
        <Badge />
      ) : null;
    } else if (tabNumber === 3) {
      // Analyze Failed tab
      badge = completedAnalyzed.some(
        (item) => item.errorMessage !== undefined
      ) ? (
        <Badge />
      ) : null;
    }

    return (
      <li className="mr-6" key={tabNumber}>
        <button
          onClick={() => onTabClick(tabNumber)}
          className={`relative inline-block p-2 ${
            activeTab === tabNumber
              ? "text-black bg-[#F1D1AB] rounded-t-lg"
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
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 pt-20 pr-8 pl-8">
        {renderTab(1, "On Analyzing")}
        {renderTab(2, "Analyzed success")}
        {renderTab(3, "Analyze Failed")}
      </ul>
      <div className="flex justify-end mx-16 mt-8">
        <div className="">
          <NavLink to="/">
            <ButtonComponent onClick={() => {}} children={"Analyze More"} />
          </NavLink>
        </div>
      </div>
      {filteredJobs.length > 0 ? (
        <div>
          {filteredJobs.map((job, index) => (
            <JobComponent index={index} job={job} progressData={progressData} />
          ))}
        </div>
      ) : (
        <div className="m-32 text-gray-500">Do not have {text}</div>
      )}
    </div>
  );
};

export default History;
