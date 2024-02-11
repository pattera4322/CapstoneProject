import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const Chart = ({
  predictedName,
  predictedData,
  predictedColumn,
  actualData,
  togglePredicted
}) => {
  const [predictedArray, setPredictedArray] = useState([]);
  const [actualArray, setActualArray] = useState([]);
  const [formattedDates, setFormattedDates] = useState([]);
  console.log(`------ Chart Phase -----`)
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

  const handleGroupedData = (dataName,data,predictedColumn) => {
    const formattedData = data.map(item => {
      const timestamp = dataName === 'actual' ? item.date : item.Date;
      const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
  
      return {
        date: date.toISOString().slice(0, 10), // Format date as "YYYY-MM-DD"
        product: dataName === 'actual' ? item.productName : item.Product,
        total: dataName === 'actual' ? (predictedColumn === 'sales' ? item.totalSales : item.quantity) : (predictedColumn === 'sales' ? item.Predicted_totalSales : item.Predicted_quantity),
        data: dataName === 'actual' ? "actual" : "prediction"
      };
    });
  
    // Group the formatted data
    const groupedData = formattedData.reduce((acc, item) => {
      acc[item.date] = acc[item.date] || { date: item.date, total: 0 };
      acc[item.date].total += item.total;
      return acc;
    }, {});
    console.log(`Group data by date of ${dataName} ${predictedColumn}`)
    console.log(groupedData)
    
    return groupedData
  }

  useEffect(() => {
    const groupedActual = handleGroupedData('actual', actualData, predictedColumn);
    const groupedPredict = handleGroupedData('prediction', predictedData, predictedColumn);

    // Extracting dates and totals from groupedActual
    const actualDates = Object.values(groupedActual).map(item => item.date);
    const actualTotals = Object.values(groupedActual).map(item => item.total);

    // Extracting dates and totals from groupedPredict
    const predictDates = Object.values(groupedPredict).map(item => item.date);
    const predictTotals = Object.values(groupedPredict).map(item => item.total);
    const mergedDates = [...actualDates, ...predictDates]

    setPredictedArray(predictTotals);
    setActualArray(actualTotals);
    setFormattedDates(mergedDates);
  }, [actualData, predictedData]);

  const chartData = {
    labels:formattedDates,
    datasets:[
    {
      label: "Actual",
      data: actualArray,
      borderColor: '#B67352',
      fill: false,
    },
    {
      label: "Prediction",
      data: predictedArray,
      borderColor: '#ECB159',
      fill: false,
    },
  ]}
  console.log(`Chart data`)
  console.log(chartData)

  return (
    <div className="h-full overflow-hidden">
      <div className="flex-grow flex items-center justify-center h-full">
        {/* <Line data={chartData} options={options} /> */}
        {togglePredicted === true? (
          <Line data={chartData} options={options} />
        ) : (
          chartData.datasets && chartData.datasets.length >= 2 ? (
            <Line data={{
              labels: chartData.labels,
              datasets: [chartData.datasets[0]] // Only using the first dataset (Actual Data)
            }} options={options} />
          ) : (<Line data={chartData} options={options} />)
        )}
      </div>
    </div>
  );
};

export default Chart;