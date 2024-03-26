import React from "react";
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import InfoPopup from "../../components/Home/InfoPopup";
import { formatDateYYYYMMDD } from "../../utils/FormatDateTime";

const ProductPieChart = ({ predictedName, predictedData, userData, actualData, togglePredicted }) => {

  const products = [
    ...new Set(
      actualData.map(
        (item) => item.productName
      )
    ),
  ];

  const handleGroupedData = (dataName, data) => {
    const formattedData = data.map(item => {
      const date = dataName === 'actual' ? item.date : item.date;
      //const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);

      return {
        date: formatDateYYYYMMDD(date), // Format date as "YYYY-MM-DD"
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

  // const data = {
  //   labels: products,
  //   datasets: [{
  //     label: 'Percent of products',
  //     data: togglePredicted === true ? arrayPercentOfMerge : arrayPercentOfActual,
  //     backgroundColor: [
  //       'rgb(255, 99, 132)',
  //       'rgb(54, 162, 235)',
  //       'rgb(255, 205, 86)',
  //       'rgb(75, 192, 192)',
  //       'rgb(153, 102, 255)',
  //       'rgb(255, 159, 64)',
  //       'rgb(255, 0, 0)',
  //       'rgb(0, 255, 0)',
  //       'rgb(0, 0, 255)',
  //       'rgb(128, 128, 128)',
  //     ],
  //     hoverOffset: 4
  //   }]
  // };

const generateRandomColor = () => {
  const baseColors = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
    'rgb(255, 159, 64)'
  ];

  const baseColorIndex = Math.floor(Math.random() * baseColors.length);
  const baseColor = baseColors[baseColorIndex];

  const variance = 40;

  const r = Math.min(255, parseInt(baseColor.slice(4, 7)) + Math.floor(Math.random() * variance * 2) - variance);
  const g = Math.min(255, parseInt(baseColor.slice(9, 12)) + Math.floor(Math.random() * variance * 2) - variance);
  const b = Math.min(255, parseInt(baseColor.slice(14, 17)) + Math.floor(Math.random() * variance * 2) - variance);

  return `rgb(${r}, ${g}, ${b})`;
};

const data = {
  labels: products,
  datasets: [{
    label: 'Percent of products',
    data: togglePredicted === true ? arrayPercentOfMerge : arrayPercentOfActual,
    backgroundColor: (() => {
      if (products.length <= 7) {
        return [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
        ];
      } else {
        const colors = [];
        for (let i = 0; i < products.length; i++) {
          colors.push(generateRandomColor());
        }
        return colors;
      }
    })(),
    hoverOffset: 4
  }]
};

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          // padding: 20,
          boxWidth: 10,
        },
      },
    },
    radius: '100%',
    spacing: 0,
    responsive: true,
    maintainAspectRatio: false,
  };

  const containerStyle = {
    width: "100%",
    height: "85%",
    // position: "relative",
    // paddingRight: "100px",
    // overflow: "auto",
  };

  const infoPie = `This graph depicts the percentage of sales quantity for each product.`;

  return (
    <div style={containerStyle}>
      <div className="pb-2">
        <label className="font-bold">% of Products</label>
        <InfoPopup infoText={infoPie} />
      </div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ProductPieChart;
