import React, { useEffect, useState } from "react";
import Chart from "../components/Dashboard/Chart";
import RelatedNews from "../components/Dashboard/RelatedNews";
import Goal from "../components/Dashboard/Goal";
import ProductPieChart from "../components/Dashboard/ProductPieChart";
import ButtonComponent from "../components/Button";
import NumberOfProducts from "../components/Dashboard/NumberOfProducts";
import Analyzed from "../components/Dashboard/Analyzed";
import { NavLink } from "react-router-dom";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const Dashboard = ({}) => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleScreenshot = () => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      html2canvas(rootElement).then((canvas) => {
        const imageData = canvas.toDataURL("image/png");

        const downloadLink = document.createElement("a");
        downloadLink.href = imageData;
        downloadLink.download = "screenshot.png";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    }
  };

  return (
    <div>
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 pt-20 pr-8 pl-8">
        <li className="mr-2">
          <button
            onClick={() => handleTabClick(1)}
            className={`inline-block p-2 ${
              activeTab === 1
                ? "text-blue-600 bg-gray-100 rounded-t-lg"
                : "rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Retail Sales
          </button>
        </li>
        <li className="mr-2">
          <button
            onClick={() => handleTabClick(2)}
            className={`inline-block p-2 ${
              activeTab === 2
                ? "text-blue-600 bg-gray-100 rounded-t-lg"
                : "rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Inventory
          </button>
        </li>
      </ul>

      <div className={`box-content p-4 ${activeTab === 1 ? "flex" : "hidden"}`}>
        <div className="flex flex-col lg:w-full pl-4 pr-4">
          <div className="flex flex-col lg:flex-row">
            <div className="box-content w-80 lg:w-9/12 lg:h-[90%] p-4 shadow-md flex-2">
              <Chart />
            </div>
            <div className="box-content w-80 p-4 shadow-md flex-1">
              Coming Soon
              {/* <RelatedNews /> */}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="box-content w-80 p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
                Coming Soon
                {/* <Analyzed /> */}
              </div>
            </div>
            <div className="box-content w-80 p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
                Coming Soon
                {/* <Goal /> */}
              </div>
            </div>
          </div>
          <div className="flex mt-4 ml-auto">
            <div>
              <ButtonComponent
                onClick={handleScreenshot}
                children={
                  <div>
                    <svg
                      className="fill-current w-4 h-4 mr-2 inline"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                    </svg>
                    Download
                  </div>
                }
              />
            </div>
            <div className="ml-2">
              <NavLink to="/">
                <ButtonComponent onClick={() => {}} children={"Analyze More"} />
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`h-[80%] box-content p-4 ${
          activeTab === 2 ? "flex" : "hidden"
        }`}
      >
        <div className="flex flex-col lg:w-full pl-4 pr-4">
          <div className="flex flex-col lg:flex-row">
            <div className="box-content w-80 lg:w-9/12 lg:h-[90%] p-4 shadow-md flex-2">
              <Chart />
            </div>
            <div className="box-content p-4 shadow-md flex-1">
              Coming Soon
              {/* <RelatedNews /> */}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="box-content w-80 p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
                Coming Soon
                {/* <Analyzed /> */}
              </div>
            </div>
            <div className="box-content w-80 p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 h-40">
                Coming Soon
                {/* <p className="pb-4">% of Products</p> */}
                {/* <ProductPieChart /> */}
              </div>
            </div>
            <div className="box-content w-80 p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
                <div>
                  {/* <NumberOfProducts /> */}
                  Coming Soon
                </div>
              </div>
            </div>
          </div>

          <div className="flex mt-4 ml-auto">
            <div>
              <ButtonComponent
                onClick={handleScreenshot}
                children={
                  <div>
                    <svg
                      className="fill-current w-4 h-4 mr-2 inline"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                    </svg>
                    Download
                  </div>
                }
              />
            </div>
            <div className="ml-2">
              <NavLink to="/">
                <ButtonComponent onClick={() => {}} children={"Analyze More"} />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
