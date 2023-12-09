import React, { useEffect,useState  } from "react";
import { Line } from "react-chartjs-2";

const Chart = ({
  predictedName,
  predictedData,
  predictedColumn,
  actualData = [],
}) => {
  const [predictedArray, setPredictedArray] =useState([]);
  const [formattedDates, setFormattedDates] = useState([]);
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

  useEffect(() => {
    const parseDataForAnalyze = JSON.parse(predictedData.replace(/'/g, '"'));
    const array = parseDataForAnalyze.map((entry) =>
      predictedColumn === "quantity"
        ? entry.Predicted_quantity
        : entry.Predicted_totalSales
    );
    const formatDate = parseDataForAnalyze.map((entry) => entry.Date);
    setPredictedArray(array);
    setFormattedDates(formatDate)
  }, [predictedData, predictedColumn]);

  const data = {
    labels: formattedDates,
    datasets: [
      {
        label: predictedName,
        data: predictedArray,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      // {
      //   label: actualData,
      //   data: [],
      //   backgroundColor: "rgba(54, 162, 235, 0.2)",
      //   borderColor: "rgba(54, 162, 235, 1)",
      //   borderWidth: 1,
      // },
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
