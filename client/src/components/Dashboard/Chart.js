import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import InfoPopup from "../../components/Home/InfoPopup";
import ButtonComponent from "../Button/Button";
import { formatDateInChart } from "../../utils/FormatDateTime";
import { saveAs } from "file-saver";
import { progress } from "@material-tailwind/react";

const Chart = ({
  predictedName,
  predictedData,
  predictedColumn,
  actualData = [],
  togglePredicted,
  getR2score,
  getMSEscore,
  getChartImage,
}) => {
  const [predictedArray, setPredictedArray] = useState([]);
  const [actualArray, setActualArray] = useState([]);
  const [formattedDates, setFormattedDates] = useState([]);
  const chartRef = useRef(null);

  const options = {
    animation: {
      onComplete: function (e) {
        chartToBase64();
      },
    },
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
        position: 'top',
        align: 'end',
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
      12,
      arrayMergedActualData
    );

    const arrayPredicted = arrayMergedPredictData.map((entry) =>
      predictedColumn === "quantity" ? entry.quantity : entry.totalSales
    );
    const arrayActual = filteredActualDataMonths.map((entry) =>
      predictedColumn === "quantity" ? entry.quantity : entry.totalSales
    );

    const predictedDataFormatted = formatDateArray(
      arrayMergedPredictData,
      false
    );
    const ActualDataFormatted = formatDateArray(
      filteredActualDataMonths,
      true
    );

    const mergedDateArray = ActualDataFormatted.concat(predictedDataFormatted);

    const array = Array(arrayActual.length).fill("undefined");
    const actualDataMergePredicted = array.concat(arrayPredicted);

    setPredictedArray(actualDataMergePredicted);
    setActualArray(arrayActual);
    setFormattedDates(mergedDateArray);
  }, [predictedData, predictedColumn]);

  const chartToBase64 = () => {
    if (chartRef.current) {
      const base64Image = chartRef.current.toBase64Image();

      if (base64Image !== "data:,") {
        getChartImage(base64Image);
      }
    }
  };

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

  const infoChart = `The prediction fit ${getR2score} % to data (Evaluated by R2 score) and estimate error of predicetion data is ${getMSEscore} (Evaluated by MSE score)`;

  return (
    <div className="h-full">
      <div className="text-left pl-5">
        <label className="pb-2 font-bold">
          {predictedColumn === "quantity"
            ? "Inventory Forecast"
            : "Retail Sales Forecast"}
        </label>
        <InfoPopup infoText={infoChart} />
      </div>

      <div className="h-[80%] overflow-auto" style={{ direction: 'rtl' }}>
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
          ) : chartData.datasets && chartData.datasets.length >= 2 ? (
            <Line
              ref={chartRef}
              data={{
                labels: chartData.labels,
                datasets: [chartData.datasets[0]], // Only using the first dataset (Actual Data)
              }}
              options={options}
              className=""
            />
          ) : (
            <Line
              ref={chartRef}
              data={chartData}
              options={options}
              className=""
            />
          )}
        </div>
      </div>
      <div className="mt-4 mb-4">
        <ul className="flex flex-wrap gap-x-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          <li>
            <ButtonComponent
              className="inline-block text-white bg-[#0068D2] hover:bg-[#3386DB] rounded-lg px-1.5 py-0.5"
              onClick={() => {}}
              children={"1 YEAR"}
            />
          </li>
          <li>
            <ButtonComponent className="inline-block text-white bg-[#0068D2] hover:bg-[#3386DB] rounded-lg px-1.5 py-0.5">
              2 Months
            </ButtonComponent>
          </li>
          <li>
            <ButtonComponent className="inline-block text-white bg-[#0068D2] hover:bg-[#3386DB] rounded-lg px-1.5 py-0.5">
              3 Months
            </ButtonComponent>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Chart;
