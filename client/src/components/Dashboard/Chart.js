import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const Chart = ({
  predictedName,
  predictedData,
  predictedColumn,
  actualData = [],
}) => {
  const [predictedArray, setPredictedArray] = useState([]);
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
    const array = predictedData.map((entry) =>
      predictedColumn === "quantity"
        ? entry.Predicted_quantity
        : entry.Predicted_totalSales
    );

    const formatDate = predictedData.map((entry) => {
      const timestamp = entry.Date;
      const milliseconds =
        timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000;
      const date = new Date(milliseconds);

      const formattedDateTime = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      return formattedDateTime;
    });
    setPredictedArray(array);
    setFormattedDates(formatDate);
  }, [predictedData, predictedColumn]);

  const data = {
    labels: formattedDates,
    datasets: [
      {
        label: predictedName,
        data: predictedArray,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      // {
      //   label: actualData,
      //   data: [],
      //   backgroundColor: "rgba(54, 162, 235, 0.2)",
      //   borderColor: "rgba(54, 162, 235, 1)",
      //   borderWidth: 1,
      // },
    ],
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="flex-grow flex items-center justify-center h-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Chart;
