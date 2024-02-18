import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const Chart = ({
  predictedName,
  predictedData,
  predictedColumn,
  actualData = [],
  togglePredicted,
}) => {
  const [predictedArray, setPredictedArray] = useState([]);
  const [actualArray, setActualArray] = useState([]);
  const [formattedDates, setFormattedDates] = useState([]);

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
      return entryDate >= threeMonthsAgo;
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
        label: predictedName,
        data: predictedArray,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "actualData",
        data: actualArray,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
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

  return (
    <div className="h-full overflow-hidden">
      <div className="flex-grow flex items-center justify-center h-full">
        {/* <Line data={chartData} options={options} /> */}
        {togglePredicted === true ? (
          <Line data={chartData} options={options} />
        ) : chartData.datasets && chartData.datasets.length >= 2 ? (
          <Line
            data={{
              labels: chartData.labels,
              datasets: [chartData.datasets[1]], // Only using the first dataset (Actual Data)
            }}
            options={options}
          />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default Chart;
