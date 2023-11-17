import { React, useState } from "react";
import { Line } from "react-chartjs-2";

const ChartRetail = () => {
  const [chartHeight, setChartHeight] = useState(300); // For fixed height chart

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    height: chartHeight,
  };

  const handleHeightChange = (e) => {
    setChartHeight(e.target.value);
  };

  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Line 1",
        data: [2, 9, 3, 15, 12, 18],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Line 2",
        data: [5, 4, 7, 8, 16, 14],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-[300px] overflow-hidden">
      <div className="flex-grow overflow-y-auto">
        <div></div>
        <div style={{ height: `${chartHeight}px` }}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ChartRetail;
