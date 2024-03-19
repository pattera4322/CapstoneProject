import React, { useEffect, useState } from "react";
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
import { getUserHistory } from "../api/userHistoryApi";
import { getNews } from '../api/newsApi';
import ReAnalyzed from "../components/Dashboard/ReAnalyzed";
import { saveAs } from "file-saver";
import { toBase64Image } from "react-chartjs-2";

import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { analyzeData } from "../api/analyzeApi";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const Dashboard = ({}) => {
  const location = useLocation();

  const fileId = location.state || {};
  console.log("fileId", fileId);

  const [analyzedData, setAnalyzedData] = useState();
  const [analyzedSalesData, setAnalyzedSalesData] = useState();
  const [analyzedQuantityData, setAnalyzedQuantityData] = useState();
  const [actualSalesData, setActualSalesData] = useState();
  const [actualQuantityData, setActualQuantityData] = useState();
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [filteredAnalyzedSalesData, setFilteredAnalyzedSalesData] = useState();
  const [filteredAnalyzedQuantityData, setFilteredAnalyzedQuantityData] =
    useState();
  const [filteredActualSalesData, setFilteredActualSalesData] = useState();
  const [filteredActualQuantityData, setFilteredActualQuantityData] =
    useState();
  const [togglePredicted, setTogglePredicted] = useState(true);
  const [keywords, setKeywords] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [baseImage, setBaseImage] = useState();

  useEffect(() => {
    getUserHistory(fileId)
      .then((res) => {
        // console.log("analyzed data", res.data);
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
        setKeywords(products);
        console.log(res.data)
      })
      .catch((error) => {
        console.log("Error: ", error);
        if (error.response.status === 404) {
          console.log("Not found history data");
        }
      });
  }, []);

  const [news, setNews] = useState([]);
  const [newsError, setNewsError] = useState('');

  useEffect(() => {
    if (news.length === 0) { // Only fetch news if it hasn't been fetched yet
        getNews(keywords)
            .then((res) => {
                if (res.length > 0) {
                    setNews(res);
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    setNewsError(error.response.data.errors[0]);
                } else {
                    setNewsError(error.response.data.errors[0]);
                    console.log(newsError);
                }
            });
      }
    }, [keywords]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleTogglePrediction = (value) => {
    setTogglePredicted(value); // True is include, False is exclude
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

    const selectedKeywords =
      product === ""
        ? products
        : [
            ...new Set(
              filteredActualQuantityData.map((item) => item.productName)
            ),
          ];

    setKeywords(selectedKeywords);
    setFilteredAnalyzedSalesData(filteredAnalyzedSalesData);
    setFilteredAnalyzedQuantityData(filteredAnalyzedQuantityData);
    setFilteredActualSalesData(filteredActualSalesData);
    setFilteredActualQuantityData(filteredActualQuantityData);
  };

  // const handleScreenshot = () => {
  //   const rootElement = document.getElementById("root");
  //   if (rootElement) {
  //     html2canvas(rootElement).then((canvas) => {
  //       const imageData = canvas.toDataURL("image/png");

  //       const downloadLink = document.createElement("a");
  //       downloadLink.href = imageData;
  //       downloadLink.download = "screenshot.png";

  //       document.body.appendChild(downloadLink);
  //       downloadLink.click();
  //       document.body.removeChild(downloadLink);
  //     });
  //   }
  // };

  const handleReAnalyzed = () => {
    setShowPopup(true); 
  }

  const getR2score = () => {
    if (selectedProduct == "") {
      const products = activeTab==1? Object.values(analyzedData.historyData.history.evalTotalSales) : Object.values(analyzedData.historyData.history.evalQuantity);
      const totalR2 = products.reduce((acc, product) => acc + product.R2, 0);
      return (totalR2 / products.length)*100 || 0;
    } else {
      return activeTab==1? (analyzedData.historyData.history.evalTotalSales[selectedProduct].R2)*100 : (analyzedData.historyData.history.evalQuantity[selectedProduct].R2)*100
    }
  }
  const getMSEscore = () => {
    if (selectedProduct == "") {
      const products = activeTab==1? Object.values(analyzedData.historyData.history.evalTotalSales) : Object.values(analyzedData.historyData.history.evalQuantity);
      const totalMSE = products.reduce((acc, product) => acc + product.MSE, 0);
      console.log(totalMSE,products.length)
      return (totalMSE / products.length).toFixed(2) || 0;
    } else {
      return activeTab==1? (analyzedData.historyData.history.evalTotalSales[selectedProduct].MSE)*100 : (analyzedData.historyData.history.evalQuantity[selectedProduct].MSE)*100
    }
  }

  const generateCSVData = (actualData,predictedData) => {
    const renamedActualData = actualData.map(item => ({
      date: item.date._seconds,
      product: item.productName,
      totalSales: item.totalSales
    }));

    const renamedAnalyzedSalesData = predictedData.map(item => ({
      date: item.date._seconds,
      product: item.Product,
      totalSales: item.Predicted_totalSales
    }));
    const combinedData = renamedActualData.concat(renamedAnalyzedSalesData);
    let csvContent = `date,product,${activeTab === 1? "totalSales": "quantity"}\n`;
    combinedData.forEach(item => {
        csvContent += `${ new Date(item.date)},${item.product},${item.totalSales}\n`;
    });

    return csvContent;
  };

  const handleBase64ImageGenerated = (imageData) => {
    // html2canvas(imageData)
    //   .then((canvas) => {
    //     // Convert the canvas to a data URL
    //     const imageDataUrl = canvas.toDataURL('image/png');
    //     setBaseImage(imageDataUrl)

    //     // Optionally, you can save the data URL to state or perform further actions
    //     console.log('Image data URL:', imageDataUrl);
    //   })
    //   .catch((error) => {
    //     console.error('Error capturing chart:', error);
    //   });
    setBaseImage(imageData);
    console.log(`Base64 in Dashboard`,baseImage)
  };

  const handleDownload = () => {
    saveAs(baseImage, `${activeTab === 1? "sales": "quantity"}ForecastGraph.png`);

    // Download graph data
    // const allData = activeTab === 1? [...actualSalesData, ...analyzedSalesData]:[...actualQuantityData, ...analyzedQuantityData]
    const csvData = generateCSVData(activeTab === 1?actualSalesData:actualQuantityData,activeTab === 1?analyzedSalesData:analyzedQuantityData);
    const blob = new Blob([csvData], { type: "text/csv" });
    saveAs(blob, `${activeTab === 1? "sales": "quantity"}_forecast_data.csv`);
    console.log(`Download`)
  };

  return (
    <div>
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 pt-20 pr-8 pl-8">
        <li className="mr-2">
          <button
            onClick={() => handleTabClick(1)}
            className={`inline-block p-2 ${
              activeTab === 1
                ? "text-white bg-[#0068D2] rounded-t-lg"
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
                ? "text-white bg-[#0068D2] rounded-t-lg"
                : "rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Inventory
          </button>
        </li>
        <li className="ml-auto mr-0">
          <button
            className="inline-block text-white bg-[#0068D2] hover:bg-[#3386DB] rounded-lg px-1.5 py-0.5"
            type="submit"
            onClick={handleReAnalyzed}
          >
            Change Personalized Insights
          </button>
        </li>
        <li className="ml-4 mr-4">
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

      {showPopup && (
        <ReAnalyzed
        handleClose={() => {
          setShowPopup(false) 
          setAnalyzedData(prevState => ({
          ...prevState,
          userData: JSON.parse(localStorage.getItem('askingItems'))
          }))
          console.log(analyzedData.userData)
        }}
        userData={analyzedData.userData}
        fileId={analyzedData.historyData.fileId}
        />
      )}

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
                  predictedColumn={activeTab === 1 ? "sales" : "quantity"}
                  actualData={
                    filteredActualSalesData
                      ? filteredActualSalesData
                      : actualSalesData
                  }
                  togglePredicted={togglePredicted}
                  getR2score={getR2score()}
                  getMSEscore={getMSEscore()}
                  onBase64ImageGenerated={(imageData) => setBaseImage(imageData)}
                />
              )}
            </div>
            <div className="box-content w-80 p-4 shadow-md flex-1 lg:h-[90%]">
              {analyzedSalesData && (
                <RelatedNews 
                keywords={keywords}
                news={news}
                error={newsError}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="box-content w-80 p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
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
                onClick={handleDownload}
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
            <div className="box-content w-80 w-9/12 h-[90%] p-4 shadow-md flex-2">
              {analyzedQuantityData && (
                <Chart
                  predictedName={"Predicted Quantity"}
                  predictedData={
                    filteredAnalyzedQuantityData
                      ? filteredAnalyzedQuantityData
                      : analyzedQuantityData
                  }
                  predictedColumn={activeTab === 1 ? "sales" : "quantity"}
                  actualData={
                    filteredActualQuantityData
                      ? filteredActualQuantityData
                      : actualQuantityData
                  }
                  togglePredicted={togglePredicted}
                  getR2score={getR2score()}
                  getMSEscore={getMSEscore()}
                  onBase64ImageGenerated={handleBase64ImageGenerated}
                />
              )}
            </div>
            <div className="box-content p-4 shadow-md flex-1 h-[90%]">
              {analyzedSalesData && (
                <RelatedNews 
                keywords={keywords}
                news={news}
                error={newsError}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="box-content w-80 p-4 shadow-md flex-1">
              <div className="text-base text-left p-4 overflow-y-auto h-40">
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
                onClick={handleDownload}
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
