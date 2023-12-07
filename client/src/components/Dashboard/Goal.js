import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Goal = () => {
  const value = 69;
  const percentage = `${value}%`;

  const data = {
    labels: ["Red"],
    datasets: [
      {
        label: "",
        data: [value],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        display: false,
      },
      y: {
        beginAtZero: true,
        max: 200,
        display: false,
      },
    },
  };

  return (
    <div className="w-full">
      <p className="pb-4">
                  The effort you're investing brings you closer to your goal
                </p>
      <div
        style={{
          position: "relative",
          height: "80px",
          // width: "100%",
          overflow: "hidden",
        }}
      >
        <Bar data={data} options={options} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "4px",
          }}
        >
          {percentage}
        </div>
      </div>
    </div>
  );
};

export default Goal;
