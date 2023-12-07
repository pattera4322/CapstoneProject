import React from "react";
import { Line } from "react-chartjs-2";

const Chart = () => {
  const options = {
    maintainAspectRatio: false,
    responsive: true,
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
  const predictedData = {
    predictedSalesValues: [
      {
        Date: "02-01-2024",
        Predicted_totalSales: 292.9173949509591,
        Product: "Beauty",
      },
      {
        Date: "03-01-2024",
        Predicted_totalSales: 1570.582610647201,
        Product: "Beauty",
      },
      {
        Date: "04-01-2024",
        Predicted_totalSales: 156.00685286792995,
        Product: "Beauty",
      },
      {
        Date: "05-01-2024",
        Predicted_totalSales: 225.68947691803365,
        Product: "Beauty",
      },
      {
        Date: "06-01-2024",
        Predicted_totalSales: 163.64488803619525,
        Product: "Beauty",
      },
      {
        Date: "07-01-2024",
        Predicted_totalSales: 184.3046473967527,
        Product: "Beauty",
      },
      {
        Date: "08-01-2024",
        Predicted_totalSales: 580.3530741260056,
        Product: "Beauty",
      },
      {
        Date: "09-01-2024",
        Predicted_totalSales: 1697.909116962451,
        Product: "Beauty",
      },
      {
        Date: "10-01-2024",
        Predicted_totalSales: 737.692243107542,
        Product: "Beauty",
      },
      {
        Date: "11-01-2024",
        Predicted_totalSales: 184.90077538611723,
        Product: "Beauty",
      },
    ],
  };
  const predictedTotalSalesArray = predictedData.predictedSalesValues
    .filter((entry) => entry.Product === "Beauty")
    .map((entry) => entry.Predicted_totalSales);

  const formattedDates = predictedData.predictedSalesValues.map((entry) => {
    const dateParts = entry.Date.split("-");
    const formattedDate = new Date(
      `${dateParts[1]}-${dateParts[0]}-${dateParts[2]}`
    );
    return formattedDate.toDateString();
  });
  console.log(formattedDates);
  const data = {
    labels: formattedDates,
    datasets: [
      {
        label: "Line 1",
        data: [
          312.38045524402474, 1528.0609387261788, 186.04205184933915,
          224.82393143247458, 193.86051560579816, 224.22253720265869,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Predicted Sale",
        data: predictedTotalSalesArray,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
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
