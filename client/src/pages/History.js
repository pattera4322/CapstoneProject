import React, { useEffect, useState } from "react";
import { socketJobProgress } from "../config/socket";
import { getQueues } from "../api/analyzeApi";
import JobComponent from "../components/History/JobComponent";
import { useLocation, NavLink } from "react-router-dom";
import ButtonComponent from "../components/Button";
import Badge from "../components/Badge";
import { useProgress } from "../context/ProgressContext";
import { getUserHistories } from "../api/userDataApi";

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
  const location = useLocation();
  socketJobProgress.connect();

  useEffect(() => {
    getQueues()
      .then((res) => {
        setQueuesData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    getUserHistories()
      .then((res) => {
        setCompletedAnalyzed(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

      socketJobProgress.emit('test', (data) => {
        console.log(`hi from socket`);
      });

      socketJobProgress.on("jobProgress", (data) => {
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
    console.log("kikiki", process.env.REACT_APP_API_URL);
    console.log("hiiii", process.env.REACT_APP_SOCKET_BASE_URL);
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

  const renderTab = (tabNumber, label) => (
    <li className="mr-6" key={tabNumber}>
      {!clickedTabs[tabNumber] && <Badge />}
      <button
        onClick={() => onTabClick(tabNumber)}
        className={`inline-block p-2 ${
          activeTab === tabNumber
            ? "text-black bg-[#F1D1AB] rounded-t-lg"
            : "rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        }`}
      >
        {label}
      </button>
    </li>
  );

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
