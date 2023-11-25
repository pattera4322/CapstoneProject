import React, { useEffect, useState } from "react";
import ChartRetail from "../components/Dashboard/ChartRetail";
import ChartInventory from "../components/Dashboard/ChartInventory";
import ChartFromCsv from "../components/Dashboard/ChartFromCsv";
import RelatedNews from "../components/Dashboard/RelatedNews";
import ChartGoal from "../components/Dashboard/ChartGoal";
import ProductPieChart from "../components/Dashboard/ProductPieChart";
import ButtonDownload from "../components/Dashboard/ButtonDownload";
import ButtonAnalyzeMore from "../components/Dashboard/ButtonAnalyzeMore";
import NumberOfProducts from "../components/Dashboard/NumberOfProducts";
import AnalyzeData from "../components/Dashboard/AnalyzeData";
import ShouldStockProduct from "../components/Dashboard/ShouldStockProduct";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const Dashboard = ({}) => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="h-screen overflow-y-auto">
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
        <div className="grid gap-1 grid-cols-1 grid-rows-1 pl-4 pr-4 h-screen lg:h-auto">
          <div className="flex flex-col lg:flex-row">
            <div className="box-content w-full lg:w-9/12 p-4 shadow-md flex-2">
              <ChartRetail />
            </div>
            <div className="box-content p-4 shadow-md flex-1">
              <RelatedNews />
            </div>
          </div>

          <div className="flex">
            <div className="box-content p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
                <p className="pb-4">Analyze data</p>
                <AnalyzeData />
              </div>
            </div>
            <div className="box-content p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
                <p className="pb-4">
                  The effort you're investing brings you closer to your goal
                </p>
                <ChartGoal />
              </div>
            </div>
          </div>
          <div className="flex mt-4 ml-auto">
            <button>
              <ButtonDownload />
            </button>
            <button className="ml-2">
              <ButtonAnalyzeMore />
            </button>
          </div>
        </div>
      </div>

      <div className={`box-content p-4 ${activeTab === 2 ? "flex" : "hidden"}`}>
        <div className="grid gap-1 grid-cols-1 grid-rows-1 pl-4 pr-4 h-screen lg:h-auto">
          <div className="flex flex-col lg:flex-row">
            <div className="box-content w-full lg:w-9/12 p-4 shadow-md flex-2">
              <ChartInventory />
            </div>
            <div className="box-content p-4 shadow-md flex-1">
              <RelatedNews />
            </div>
          </div>

          <div className="flex">
            <div className="box-content p-4 shadow-md flex-1">
              <div className="text-base text-left p-4">
                <p className="pb-4">You should stock products</p>
                <ShouldStockProduct />
              </div>
            </div>
            <div className="box-content p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 h-40 overflow-hidden">
                <p className="pb-4">% of Products</p>
                <ProductPieChart />
              </div>
            </div>
            <div className="box-content p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
                <p className="pb-4">Number of Products</p>
                <div>
                  <NumberOfProducts />
                </div>
              </div>
            </div>
          </div>
          <div className="flex mt-4 ml-auto">
            <button>
              <ButtonDownload />
            </button>
            <button className="ml-2">
              <ButtonAnalyzeMore />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
