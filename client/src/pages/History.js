import React, { useEffect, useState } from "react";
import { socket } from "../config/socket";
import { getQueuesDataByUser } from "../api/analyzeApi";
import JobComponent from "../components/History/JobComponent";

const History = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getQueuesDataByUser().then((res) => {
      console.log("queues jobbbb:", res);
      if(res){
       setJobs(res.jobs); 
      }
    });

    socket.on("jobProgress", (data) => {
      // Update the progress in the component state
      setProgressData(data);

      if (data.progress === 100) {
        // Fetch updated jobs when progress reaches 100
        getQueuesDataByUser().then((res) => {
          if(res){
            setJobs(res.jobs); 
           }
        });
      }
    });

    // return () => {
    //   socket.disconnect(); // Cleanup the socket connection on component unmount
    // };
  }, []);

  useEffect(() => {
    const filterJobsByState = (state) => {
      if (state === "activeOrWaiting") {
        const filteredJobs = jobs.filter(
          (job) => job.state === "active" || job.state === "waiting"
        );
        return filteredJobs.sort((a, b) => a.id - b.id);
      }
      return jobs.filter((job) => job.state === state);
    };

    switch (activeTab) {
      case 1:
        setFilteredJobs(filterJobsByState("activeOrWaiting"));
        setText("Analyzing data in queue yet");
        break;
      case 2:
        setFilteredJobs(filterJobsByState("completed"));
        setText("Completed data yet");
        break;
      case 3:
        setFilteredJobs(filterJobsByState("failed"));
        setText("failed data");
        break;
      default:
        setFilteredJobs(jobs);
    }
  }, [jobs, activeTab]);

  console.log("dfdfdf", filteredJobs);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderTab = (tabNumber, label) => (
    <li className="mr-6" key={tabNumber}>
      <button
        onClick={() => handleTabClick(tabNumber)}
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
      {filteredJobs.length > 0 ? (
        <div>
          {filteredJobs.map((job) => (
            <JobComponent job={job} progressData={progressData} />
          ))}
        </div>
      ) : (
        <div className="m-32 text-gray-500">Do not have {text}</div>
      )}
    </div>
  );
};

export default History;
