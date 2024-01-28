import React, { useEffect, useState } from "react";
import { getQueuesData } from "../api/analyzeApi";

const History = () => {
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    getQueuesData().then((res) => {
      console.log("queues jobbbb:", res);
    });
  });

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
    </div>
  );
};

export default History;
