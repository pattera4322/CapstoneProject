import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Chart from "../components/Dashboard/Chart";
import { useLocation, NavLink } from "react-router-dom";
import RelatedNews from "../components/Dashboard/RelatedNews";
import Goal from "../components/Dashboard/Goal";
import ProductPieChart from "../components/Dashboard/ProductPieChart";
import ButtonComponent from "../components/Button";
import NumberOfProducts from "../components/Dashboard/NumberOfProducts";
import Analyzed from "../components/Dashboard/Analyzed";
import DropdownFilter from "../components/Dashboard/Filter";
import TogglePrediction from "../components/Dashboard/TogglePrediction";
import { getUserHistory } from "../api/userDataApi";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const Dashboard = ({ }) => {
  const location = useLocation();

  //TODO:uncomment when can use tensorflow and success do dashboard --------------------------------------------------------
  // const fileId = location.state || {};
  //console.log("fileIdd",fileId)
  const fileId = 5;

  const [analyzedData, setAnalyzedData] = useState();
  const [analyzedSalesData, setAnalyzedSalesData] = useState();
  const [analyzedQuantityData, setAnalyzedQuantityData] = useState();
  const [actualSalesData, setActualSalesData] = useState();
  const [actualQuantityData, setActualQuantityData] = useState();
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [filteredAnalyzedSalesData, setFilteredAnalyzedSalesData] = useState();
  const [filteredAnalyzedQuantityData, setFilteredAnalyzedQuantityData] = useState();
  const [filteredActualSalesData, setFilteredActualSalesData] = useState();
  const [filteredActualQuantityData, setFilteredActualQuantityData] = useState();
  const [togglePredicted, setTogglePredicted] = useState(true);
  const [keywords, setKeywords] = useState([])

  useEffect(() => {
    getUserHistory(fileId)
      .then((res) => {
        console.log("analyzed data", res.data);
        setAnalyzedData(res.data);
        setAnalyzedSalesData(res.data.historyData.history.predictedSalesValues);
        setAnalyzedQuantityData(
          res.data.historyData.history.predictedQuantityValues
        );
        setActualSalesData(res.data.historyData.history.actualSalesValues);
        setActualQuantityData(
          res.data.historyData.history.actualQuantityValues
        );
        const products = [
          ...new Set(
            res.data.historyData.history.actualSalesValues.map(
              (item) => item.productName
            )
          ),
        ];

        setProducts(products);
        setKeywords(products)
        console.log("name of Products", products);
      })
      .catch((error) => {
        console.log("Error: ", error);
        if (error.response.status === 404) {
          console.log("Not found history data");
        }
      });
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleTogglePrediction = (value) => {
    setTogglePredicted(value);
    console.log(`Toggle including prediction to => ${togglePredicted}`); // True is include, False is exclude
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);

    const filteredAnalyzedSalesData = analyzedSalesData.filter((item) => {
      return product === "" || item.Product === product;
    });

    const filteredAnalyzedQuantityData = analyzedQuantityData.filter((item) => {
      return product === "" || item.Product === product;
    });

    const filteredActualSalesData = actualSalesData.filter((item) => {
      return product === "" || item.productName === product;
    });

    const filteredActualQuantityData = actualQuantityData.filter((item) => {
      return product === "" || item.productName === product;
    });

    const selectedKeywords = product === ""? products : [...new Set(filteredActualQuantityData.map((item) => item.productName))]

    setKeywords(selectedKeywords)
    console.log(`selectedKeywords`)
    console.log(selectedKeywords)
    setFilteredAnalyzedSalesData(filteredAnalyzedSalesData);
    setFilteredAnalyzedQuantityData(filteredAnalyzedQuantityData);
    setFilteredActualSalesData(filteredActualSalesData);
    setFilteredActualQuantityData(filteredActualQuantityData);
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
            className={`inline-block p-2 ${activeTab === 1
                ? "text-black bg-[#F1D1AB] rounded-t-lg"
                : "rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              }`}
          >
            Retail Sales
          </button>
        </li>
        <li className="mr-2">
          <button
            onClick={() => handleTabClick(2)}
            className={`inline-block p-2 ${activeTab === 2
                ? "text-black bg-[#F1D1AB] rounded-t-lg"
                : "rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              }`}
          >
            Inventory
          </button>
        </li>
        <li className="ml-auto mr-4">
          <DropdownFilter
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={handleSelectProduct}
          />
        </li>
        <li className="end-1">
          <TogglePrediction
            defaultChecked={togglePredicted}
            onToggle={handleTogglePrediction}
            label={"Enable prediction"}
          />
        </li>
      </ul>

      <div className={`box-content p-4 ${activeTab === 1 ? "flex" : "hidden"}`}>
        <div className="flex flex-col lg:w-full pl-4 pr-4">
          <div className="flex flex-col lg:flex-row">
            <div className="box-content w-80 lg:w-9/12 lg:h-[90%] p-4 shadow-md flex-2">
              {analyzedSalesData && (
                <Chart
                  predictedName={"Predicted Sales"}
                  predictedData={
                    filteredAnalyzedSalesData
                      ? filteredAnalyzedSalesData
                      : analyzedSalesData
                  }
                  predictedColumn={"sales"}
                  actualData={
                    filteredActualSalesData
                      ? filteredActualSalesData
                      : actualSalesData
                  }
                  togglePredicted={togglePredicted}
                />
              )}
            </div>
            <div className="box-content w-80 p-4 shadow-md flex-1">
              {/* Coming Soon */}
              {analyzedSalesData && (
                <RelatedNews 
                keywords={keywords}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="box-content w-80 p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
                {/* Coming Soon */}
                {actualSalesData && analyzedSalesData && (
                  <Analyzed
                    predictedName={"Predicted Sales"}
                    predictedData={
                      filteredAnalyzedSalesData
                        ? filteredAnalyzedSalesData
                        : analyzedSalesData
                    }
                    userData={analyzedData.userData}
                    actualData={
                      filteredActualSalesData
                        ? filteredActualSalesData
                        : actualSalesData
                    }
                    togglePredicted={togglePredicted}
                  />
                )}
              </div>
            </div>
            <div className="box-content w-80 p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
                {actualSalesData && analyzedSalesData && (
                  <Goal
                    predictedName={"Predicted Sales"}
                    predictedData={
                      filteredAnalyzedSalesData
                        ? filteredAnalyzedSalesData
                        : analyzedSalesData
                    }
                    userData={analyzedData.userData}
                    actualData={
                      filteredActualSalesData
                        ? filteredActualSalesData
                        : actualSalesData
                    }
                    togglePredicted={togglePredicted}
                  />
                )}
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
                <ButtonComponent onClick={() => { }} children={"Analyze More"} />
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`h-[80%] box-content p-4 ${activeTab === 2 ? "flex" : "hidden"
          }`}
      >
        <div className="flex flex-col lg:w-full pl-4 pr-4">
          <div className="flex flex-col lg:flex-row">
            <div className="box-content w-80 lg:w-9/12 lg:h-[90%] p-4 shadow-md flex-2">
              {analyzedQuantityData && (
                <Chart
                  predictedName={"Predicted Quantity"}
                  predictedData={
                    filteredAnalyzedQuantityData
                      ? filteredAnalyzedQuantityData
                      : analyzedQuantityData
                  }
                  predictedColumn={"quantity"}
                  actualData={
                    filteredActualQuantityData
                      ? filteredActualQuantityData
                      : actualQuantityData
                  }
                  togglePredicted={togglePredicted}
                />
              )}
            </div>
            <div className="box-content p-4 shadow-md flex-1">
              {/* Coming Soon */}
              {analyzedSalesData && (
                <RelatedNews
                keywords={keywords}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="box-content w-80 p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
                {/* Coming Soon */}
                {actualQuantityData && analyzedQuantityData && (
                  <Analyzed
                    predictedName={"Predicted Quantity"}
                    predictedData={
                      filteredAnalyzedQuantityData
                        ? filteredAnalyzedQuantityData
                        : analyzedQuantityData
                    }
                    userData={analyzedData.userData}
                    actualData={
                      filteredActualQuantityData
                        ? filteredActualQuantityData
                        : actualQuantityData
                    }
                    togglePredicted={togglePredicted}
                  />
                )}
              </div>
            </div>
            <div className="box-content w-80 p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 h-40">
                {/* Coming Soon */}

                <p className="pb-4 font-bold">% of Products</p>
                {analyzedData && (
                  <ProductPieChart
                    predictedName={"Predicted Quantity"}
                    predictedData={
                      filteredAnalyzedQuantityData
                        ? filteredAnalyzedQuantityData
                        : analyzedQuantityData
                    }
                    userData={analyzedData.userData}
                    actualData={
                      filteredActualQuantityData
                        ? filteredActualQuantityData
                        : actualQuantityData
                    }
                    togglePredicted={togglePredicted}
                  />
                )}
              </div>
            </div>
            <div className="box-content w-80 p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
                <div>
                  {/* Coming Soon */}
                  {analyzedData && (
                  <NumberOfProducts
                    predictedName={"Predicted Quantity"}
                    predictedData={
                      filteredAnalyzedQuantityData
                        ? filteredAnalyzedQuantityData
                        : analyzedQuantityData
                    }
                    userData={analyzedData.userData}
                    actualData={
                      filteredActualQuantityData
                        ? filteredActualQuantityData
                        : actualQuantityData
                    }
                    togglePredicted={togglePredicted}
                    products={products}
                  />
                )}
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
                <ButtonComponent onClick={() => { }} children={"Analyze More"} />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
