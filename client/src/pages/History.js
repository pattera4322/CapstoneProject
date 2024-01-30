import React, { useEffect, useState } from "react";
import { socket } from "../config/socket";
import { getQueuesData } from "../api/analyzeApi";
import ProgressBar from "../components/ProgressBar";

const History = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getQueuesData().then((res) => {
      console.log("queues jobbbb:", res);
      setJobs(res.jobs);
    });   

    socket.on("jobProgress", (data) => {
      // Update the progress in the component state
      setProgress(data.progress);  
    });

    // return () => {
    //   socket.disconnect(); // Cleanup the socket connection on component unmount
    // };
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderTab = (tabNumber, label) => (
    <li className="mr-6" key={tabNumber}>
      <button
        onClick={() => handleTabClick(tabNumber)}
        className={`inline-block p-2 ${
          activeTab === tabNumber
            ? "text-white bg-brown-200 rounded-t-lg"
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
      {jobs[0] ? (
        <div>
          {jobs.map((job) => (
            <div
              className="transition ease-in-out hover:-translate-y-1 hover:scale-10 mx-16 my-8 px-8 py-8 rounded-md text-left shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]"
              key={job.id}
            >
              Job ID: {job.id}
              {/* Job Name: {job.name} */}
              <br />
              Job Data: {JSON.stringify(job.data)}
              <br />
              Job State: {job.state}
              <div>
                <ProgressBar showProgress={true} progress={progress} text={"Job progress:"}/>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="m-32 text-gray-500">
          Do not have analysis in progress or in the queue.
        </div>
      )}
    </div>
  );
};

export default History;
