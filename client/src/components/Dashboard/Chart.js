import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import InfoPopup from "../../components/Home/InfoPopup";
import { Button } from "@material-tailwind/react";
// import ChartjsPluginScrollBar from 'chartjs-plugin-scroll-bar';

const Chart = ({
  predictedName,
  predictedData,
  predictedColumn,
  actualData = [],
  togglePredicted,
  getR2score,
  getMSEscore
}) => {
  const [predictedArray, setPredictedArray] = useState([]);
  const [actualArray, setActualArray] = useState([]);
  const [formattedDates, setFormattedDates] = useState([]);
  // Line.register(ChartjsPluginScrollBar);

  const options = {
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
    // plugins: {
    //   scrollBar: {enable: true, scrollType: 'Horizontal'},
    // },
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

    const latestDate = new Date(
      arrayMergedActualData[arrayMergedActualData.length - 1].date * 1000
    );

    const threeMonthsAgo = new Date(latestDate);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const filteredActualData3Months = arrayMergedActualData.filter((entry) => {
      const entryDate = new Date(entry.date * 1000);
      // return entryDate >= threeMonthsAgo;
      return entryDate
    });

    const arrayPredicted = arrayMergedPredictData.map((entry) =>
      predictedColumn === "quantity"
        ? entry.quantity
        : entry.totalSales
    );
    const arrayActual = filteredActualData3Months.map((entry) =>
      predictedColumn === "quantity" ? entry.quantity : entry.totalSales
    );

    const predictedDataFormatted = formatDateArray(
      arrayMergedPredictData,
      false
    );
    const ActualDataFormatted = formatDateArray(
      filteredActualData3Months,
      true
    );

    const mergedDateArray = ActualDataFormatted.concat(predictedDataFormatted);

    const array = Array(arrayActual.length).fill("undefined");
    const actualDataMergePredicted = array.concat(arrayPredicted);

    setPredictedArray(actualDataMergePredicted);
    setActualArray(arrayActual);
    setFormattedDates(mergedDateArray);
  }, [predictedData, predictedColumn]);

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
      }
    ],
  };

  function formatDateArray(dataArray) {
    return dataArray.map((entry) => {
      const timestamp = entry.date;
      const milliseconds = timestamp * 1000;
      const date = new Date(milliseconds);

      // const formattedDateTime = `${date.getFullYear()}-${(date.getMonth() + 1)
      //   .toString()
      //   .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const formattedDateTime = `${date
        .getDate()
        .toString()
        .padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;

      return formattedDateTime;
    });
  }

  function sumValueByDate(arr, checkActual, predictedColumn) {
    const valuesSums = {};
  
    arr.forEach((item) => {
      let values, date;
      date = item.date;
      if (checkActual) {
        values = predictedColumn === "quantity" ? item.quantity : item.totalSales;
      } else {
        values = predictedColumn === "quantity" ? item.Predicted_quantity : item.Predicted_totalSales;
      }
  
      const seconds = date._seconds;
      valuesSums[seconds] = (valuesSums[seconds] || 0) + values;
    });
  
    const uniqueDates = Object.keys(valuesSums).map((seconds) => ({
      date: Number(seconds),
      [predictedColumn === "quantity" ? "quantity" : "totalSales"]: valuesSums[seconds],
    }));
  
    return uniqueDates;
  }
  const infoChart = `The prediction fit ${getR2score} % to data and estimate error of predicetion data is ${getMSEscore} `;

  return (
    <div className="h-full overflow-hidden">
      <div className="text-left pl-5">
        <label className="pb-2 font-bold">{predictedColumn === "quantity" ? "Inventory Forecast" : "Retail Sales Forecast"}</label>
        <InfoPopup infoText={infoChart}/>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center h-[95%] scroll-auto">
        {/* <Line data={chartData} options={options} /> */}
        {togglePredicted === true ? (
          <Line data={chartData} options={options} className=""/>
        ) : chartData.datasets && chartData.datasets.length >= 2 ? (
          <Line
            data={{
              labels: chartData.labels,
              datasets: [chartData.datasets[0]], // Only using the first dataset (Actual Data)
            }}
            options={options}
            className=""
          />
        ) : (
          <Line data={chartData} options={options} className=""/>
        )}
        
        {/* <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
          <li>
            <Button className="inline-block text-white bg-[#0068D2] hover:bg-[#3386DB] rounded-lg px-1.5 py-0.5">
              1 Year
            </Button>
          </li>
          <li>
            <Button className="inline-block text-white bg-[#0068D2] hover:bg-[#3386DB] rounded-lg px-1.5 py-0.5">
              2 Months
            </Button>
          </li>
          <li>
            <Button className="inline-block text-white bg-[#0068D2] hover:bg-[#3386DB] rounded-lg px-1.5 py-0.5">
              3 Months
            </Button>
          </li>
        </ul> */}
      </div>
    </div>
  );
};

export default Chart;
