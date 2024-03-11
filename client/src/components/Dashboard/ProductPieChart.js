import React from "react";
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import InfoPopup from "../../components/Home/InfoPopup";

const ProductPieChart = ({predictedName, predictedData, userData, actualData, togglePredicted}) => {

  const products = [
    ...new Set(
      actualData.map(
        (item) => item.productName
      )
    ),
  ];

  const handleGroupedData = (dataName,data) => {
    const formattedData = data.map(item => {
      const timestamp = dataName === 'actual' ? item.date : item.date;
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
    
    return groupedData
  }
  
  const groupedActual = handleGroupedData('actual', actualData);
  const groupedPredict = handleGroupedData('prediction', predictedData);
  const mergedGroupedActualAndPredict = {}

  Object.keys(groupedActual).forEach(productName => {
    mergedGroupedActualAndPredict[productName] = {
        product: productName,
        total: groupedActual[productName].total + groupedPredict[productName].total
    };
  });
  const totalActual = Object.values(groupedActual).reduce((acc, { total }) => acc + total, 0);
  const totalmerged = Object.values(mergedGroupedActualAndPredict).reduce((acc, { total }) => acc + total, 0);

  const arrayPercentOfActual = Object.keys(groupedActual).map(productName => {
    const actualTotal = groupedActual[productName].total;
    const percentage = (actualTotal / totalActual) * 100;
    return Math.round(percentage * 100) / 100;
  })

  const arrayPercentOfMerge = Object.keys(mergedGroupedActualAndPredict).map(productName => {
    const mergedTotal = mergedGroupedActualAndPredict[productName].total;
    const percentage = (mergedTotal / totalmerged) * 100;
    return Math.round(percentage * 100) / 100; 
  })

  const data = {
    labels: products,
    datasets: [{
      label: 'Percent of products',
      data: togglePredicted === true ? arrayPercentOfMerge : arrayPercentOfActual,
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

  const infoPie = `This graph depicts the percentage of sales quantity for each product.`;

  return (
    <div style={containerStyle}>
      <div className="pb-2">
        <label className="pb-4 font-bold">% of Products</label>
        <InfoPopup infoText={infoPie}/>
      </div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ProductPieChart;
