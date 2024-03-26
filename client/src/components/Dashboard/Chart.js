import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import InfoPopup from "../../components/Home/InfoPopup";
import ButtonComponent from "../Button/Button";
import { formatDateInChart } from "../../utils/FormatDateTime";
import FilterMonth from "./FilterMonth.js";
import { saveAs } from "file-saver";
import { toBase64Image} from "react-chartjs-2";

const Chart = ({
  predictedName,
  predictedData,
  predictedColumn,
  actualData = [],
  togglePredicted,
  getR2score,
  getMSEscore,
  fileId
  // getChartImage,
}) => {
  const [predictedArray, setPredictedArray] = useState([]);
  const [actualArray, setActualArray] = useState([]);
  const [formattedDates, setFormattedDates] = useState([]);
  const [filterMonths, setFilterMonths] = useState(0);
  const [maxMonths, setMaxMonths] = useState(0);
  const chartRef = useRef(null);

  const options = {
    // animation: {
    //   onComplete: function (e) {
    //     // console.log(e);
    //     chartToBase64();
    //   },
    // },
    animation: true,
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: predictedColumn,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
      },
    },
  };

  const chartData = {
    labels: formattedDates,
    datasets: [
      {
        label: "actualData",
        data: actualArray,
        backgroundColor: "rgba(0, 104, 210, 0.2)",
        borderColor: "rgba(0, 104, 210)",
        borderWidth: 1,
      },
      {
        label: predictedName,
        data: predictedArray,
        backgroundColor: "rgba(0, 219, 114, 0.2)",
        borderColor: "rgba(0, 219, 114)",
        borderWidth: 1,
        borderDash: [12, 2],
      },
    ],
  };

  useEffect(() => {
    const arrayMergedActualData = sumValueByDate(
      actualData,
      true,
      predictedColumn
    );
    const monthCount = getUniqueMonthsCount(arrayMergedActualData);
    setMaxMonths(monthCount);
    setFilterMonths(monthCount);
  }, [predictedColumn]);

  useEffect(() => {
    const arrayMergedPredictData = sumValueByDate(
      predictedData,
      false,
      predictedColumn
    );
    const arrayMergedActualData = sumValueByDate(
      actualData,
      true,
      predictedColumn
    );

    const filteredActualDataMonths = handleFilterMonth(
      filterMonths,
      arrayMergedActualData
    );

    const arrayPredicted = arrayMergedPredictData.map((entry) =>
      predictedColumn === "quantity" ? entry.quantity : entry.totalSales
    );
    const arrayActual = filteredActualDataMonths.map((entry) =>
      predictedColumn === "quantity" ? entry.quantity : entry.totalSales
    );

    const predictedDataFormatted = formatDateArray(arrayMergedPredictData);
    const ActualDataFormatted = formatDateArray(filteredActualDataMonths);

    const mergedDateArray = ActualDataFormatted.concat(predictedDataFormatted);

    const array = Array(arrayActual.length).fill("undefined");
    const actualDataMergePredicted = array.concat(arrayPredicted);

    setPredictedArray(actualDataMergePredicted);
    setActualArray(arrayActual);
    setFormattedDates(mergedDateArray);
  }, [predictedData, predictedColumn, filterMonths]);

  // useEffect(() => {
  //   chartToBase64();
  // }, [actualArray, predictedArray])

  // const chartToBase64 = () => {
  //   if (chartRef.current) {
  //     const base64Image = chartRef.current.toBase64Image();

  //     if (base64Image !== "data:,") {
  //       getChartImage(base64Image);
  //     }
  //   }
  // };

  function formatDateArray(dataArray) {
    return dataArray.map((entry) => {
      return formatDateInChart(entry.date);
    });
  }

  function sumValueByDate(arr, checkActual, predictedColumn) {
    const valuesSums = {};

    arr.forEach((item) => {
      let values, date;
      date = item.date;
      if (checkActual) {
        values =
          predictedColumn === "quantity" ? item.quantity : item.totalSales;
      } else {
        values =
          predictedColumn === "quantity"
            ? item.Predicted_quantity
            : item.Predicted_totalSales;
      }

      const seconds = date._seconds;
      valuesSums[seconds] = (valuesSums[seconds] || 0) + values;
    });

    const uniqueDates = Object.keys(valuesSums).map((seconds) => ({
      date: Number(seconds),
      [predictedColumn === "quantity" ? "quantity" : "totalSales"]:
        valuesSums[seconds],
    }));

    return uniqueDates;
  }

  const handleFilterMonth = (month, array) => {
    const latestDate = new Date(array[array.length - 1].date * 1000);

    const latestMonthsAgo = new Date(latestDate);
    latestMonthsAgo.setMonth(latestMonthsAgo.getMonth() - month);

    const filteredActualDataMonths = array.filter((entry) => {
      const entryDate = new Date(entry.date * 1000);
      return entryDate >= latestMonthsAgo;
    });
    return filteredActualDataMonths;
  };

  const getUniqueMonthsCount = (array) => {
    const uniqueMonths = new Set();
    array.forEach((dateData) => {
      const date = new Date(dateData.date * 1000);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      uniqueMonths.add(monthYear);
    });

    return uniqueMonths.size;
  };

  const handleRangeChange = (months) => {
    setFilterMonths(months);
  };

  const handleDownload = () => {
    const base64Image = chartRef.current.toBase64Image();
    console.log("base64",base64Image)
    saveAs(base64Image, `${predictedColumn}_ForecastGraph_${fileId}.png`);
  };

  const infoChart = `The prediction fit ${getR2score} % to data (Evaluated by R2 score) and estimate error of predicetion data is ${getMSEscore} (Evaluated by MSE score)`;

  return (
    <div className="h-full">
      <div className="text-left pl-5 flex items-center justify-between">
        <div className="flex items-center">
          <label className=" font-bold">
            {predictedColumn === "quantity"
              ? "Inventory Forecast"
              : "Retail Sales Forecast"}
          </label>
          <InfoPopup infoText={infoChart} />
        </div>
        <div className="">
          <FilterMonth months={maxMonths} onRangeChange={handleRangeChange} />
        </div>
        <span className="float-right" onClick={handleDownload}>
          <svg
            className="fill-current w-4 h-4 mr-2 inline"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
          </svg>
        </span>
      </div>

      <div className="h-[95%] overflow-auto" style={{ direction: "rtl" }}>
        <div className="flex-grow flex flex-col items-center justify-center h-full w-[250%]">
          {/* <div className="chart-container" style={{ overflowX: "auto", width: "150%",height: "100%", padding: "0 20px" }}> */}
          {/* <Line data={chartData} options={options} /> */}
          {togglePredicted === true ? (
            <Line
              ref={chartRef}
              data={chartData}
              options={options}
              className=""
            />
          ) : (
            <Line
              ref={chartRef}
              data={{
                labels: chartData.labels,
                datasets: [chartData.datasets[0]], // Only using the first dataset (Actual Data)
              }}
              options={options}
              className=""
            />
          )}
        </div>
      </div>
      {/* <div className="mt-4 mb-4">
        <FilterMonth months={maxMonths} onRangeChange={handleRangeChange} />
      </div> */}
    </div>
  );
};

export default Chart;
