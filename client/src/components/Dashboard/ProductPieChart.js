import React from "react";
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

const ProductPieChart = () => {
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'X', 'Y', 'Z'],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100, 200, 40, 90],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
      ],
      hoverOffset: 4
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right', // Move legend to the right
      },
    },
    radius: '100%',
    spacing: 0,
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Disable aspect ratio constraint
    width: 200, // Set the desired width
    height: 200, // Set the desired height
  };

  const containerStyle = {
    width: "100%",
    height: "80%",
    marginLeft: "-20%", // Use a negative value for left margin
  };

  return (
    <div style={containerStyle}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ProductPieChart;
