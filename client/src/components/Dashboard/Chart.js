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
  console.log(`------ Chart Phase -----`);
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
    //   scales: {
    //     x: {
    //         type: 'time',
    //         time: {
    //             displayFormats: {
    //                 quarter: 'DD MMM YYYY'
    //             }
    //         }
    //     }
    // }
  };

  useEffect(() => {
    const latestDate = new Date(
      actualData[actualData.length - 1].date._seconds * 1000
    );

    const threeMonthsAgo = new Date(latestDate);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const filteredActualData3Months = actualData.filter((entry) => {
      const entryDate = new Date(entry.date._seconds * 1000);
      return entryDate >= threeMonthsAgo;
    });
    console.log(predictedData)
    const arrayPredicted = predictedData.map((entry) =>
      predictedColumn === "quantity"
        ? entry.Predicted_quantity
        : entry.Predicted_totalSales
    );
    const arrayActual = filteredActualData3Months.map((entry) =>
      predictedColumn === "quantity" ? entry.quantity : entry.totalSales
    );

    const predictedDataFormatted = formatDateArray(predictedData, false);
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

  function formatDateArray(dataArray, checkActual) {
    return dataArray.map((entry) => {
      
      const timestamp = entry.date;
      const milliseconds =
        timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000;
      const date = new Date(milliseconds);

      // const formattedDateTime = `${date.getFullYear()}-${(date.getMonth() + 1)
      //   .toString()
      //   .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const formattedDateTime = `${date.getDate().toString().padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;

      return formattedDateTime;
    });
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
