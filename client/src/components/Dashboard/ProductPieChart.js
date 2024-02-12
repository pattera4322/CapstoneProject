import React from "react";
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

const ProductPieChart = ({predictedName, predictedData, userData, actualData, togglePredicted, products}) => {
  console.log(`------ Pie Chart Analyze -----`)

  const handleGroupedData = (dataName,data) => {
    const formattedData = data.map(item => {
      const timestamp = dataName === 'actual' ? item.date : item.Date;
      const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
  
      return {
        date: date.toISOString().slice(0, 10), // Format date as "YYYY-MM-DD"
        product: dataName === 'actual' ? item.productName : item.Product,
        total: dataName === 'actual' ? item.quantity : item.Predicted_quantity,
        data: dataName === 'actual' ? "actual" : "prediction"
      };
    });
  
    // Group the formatted data
    const groupedData = formattedData.reduce((acc, item) => {
      acc[item.product] = acc[item.product] || { product: item.product, total: 0 };
      acc[item.product].total += item.total;
      return acc;
    }, {});
    console.log(`Group data by product of ${dataName} ${groupedData.product}`)
    console.log(groupedData)
    
    return groupedData
  }
  
  const groupedActual = handleGroupedData('actual', actualData);
  const groupedPredict = handleGroupedData('prediction', predictedData);
  console.log(`Grouped by Products`)
  console.log(groupedActual)
  console.log(groupedPredict)



  const data = {
    labels: products,
    datasets: [{
      label: 'Percent of products',
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
  };

  const containerStyle = {
    width: "100%",
    height: "80%",
    paddingRight: "100px"
  };

  return (
    <div style={containerStyle}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ProductPieChart;
