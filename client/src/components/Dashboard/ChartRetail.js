import React from "react";
import { Line } from "react-chartjs-2";

const ChartRetail = () => {
  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Line 1",
        data: [12, 19, 3, 5, 2, 8],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Line 2",
        data: [5, 7, 10, 8, 6, 4],
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

export default ChartRetail;
