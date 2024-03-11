import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import InfoPopup from "../../components/Home/InfoPopup";

const Goal = ({predictedName, predictedData, userData, actualData, togglePredicted}) => { 
  const salesGoal = userData.salesGoal === 0? 1 : userData.salesGoal

  const predictedSales = predictedData.map(item => Math.round(item.Predicted_totalSales));
  const actualSales = actualData.map(item => item.totalSales);
  const sumActualSales = actualSales.reduce((acc, currentValue) => acc + currentValue, 0)
  const sumPredictedSales = predictedSales.reduce((acc, currentValue) => acc + currentValue, 0)

  const actualAndPredeictedPercent = Math.round(((sumPredictedSales+sumActualSales)/salesGoal)*100)
  const actualPercent = Math.round((sumActualSales/salesGoal)*100)
  const percentage = `${togglePredicted? actualAndPredeictedPercent  : actualPercent}%`;

  const data = {
    labels: ["Red"],
    datasets: [
      {
        label: "Goal",
        data: [togglePredicted? actualAndPredeictedPercent  : actualPercent],
        backgroundColor: "rgba(0, 219, 114)",
        borderColor: "rgba(0, 219, 114)",
        borderWidth: 1,
        barThickness: 30,
      }
    // datasets: [
    //   {
    //     label: "Goal",
    //     data: [100],
    //     backgroundColor: "#F5F5F5",
    //     borderColor: "#F5F5F5",
    //     borderWidth: 1,
    //     barThickness: 30,
    //   },
    //   {
    //     label: "Present",
    //     data: [togglePredicted? actualAndPredeictedPercent  : actualPercent],
    //     backgroundColor: "rgba(0, 219, 114)",
    //     borderColor: "rgba(0, 219, 114)",
    //     borderWidth: 1,
    //     barThickness: 30,
    //   }
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
        // borderWidth: 2,
        borderRadius: 9,
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
  const infoGoal = `This visualization shows the percentage of sales growth compared to your set goal of ${salesGoal} Baht.`;

  return (
    <div className="w-full">
      <div>
        <label className="font-bold">The effort you're investing brings you closer to your goal</label>
        <InfoPopup infoText={infoGoal}/>
      </div>
      <div
        style={{
          position: "relative",
          height: "80px",
          // width: "100%",
          // overflow: "hidden",
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
      <span className="text-xs text-gray-500">that your goal is {salesGoal} Baht</span>
    </div>
  );
};

export default Goal;
