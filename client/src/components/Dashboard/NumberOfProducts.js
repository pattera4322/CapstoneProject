import React from "react";
import InfoPopup from "../../components/Home/InfoPopup";
import { formatDateYYYYMMDD } from "../../utils/FormatDateTime";

const NumberOfProducts = ({predictedName, predictedData, userData, actualData, togglePredicted, products}) => {

  const handleGroupedData = (dataName,data) => {
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
        total: Math.round(groupedActual[productName].total + groupedPredict[productName].total)
    };
  });

  const infoNoOfProduct = `This graph depicts a number of sales quantity for each product.`;

  return (
    <div>
      <div className="pb-2">
        <label className="pb-4 font-bold">Number of Products</label>
        <InfoPopup infoText={infoNoOfProduct}/>
      </div>
      
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Product Name</th>
                <th className="py-2 px-4 border-b">Number of Products</th>
                <th className="py-2 px-4 border-b">Units</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(togglePredicted ? mergedGroupedActualAndPredict : groupedActual).map((productName, index) => (
                <tr key={index} className={(index + 1) % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="py-2 px-4 border-b">{productName}</td>
                  <td className="py-2 px-4 border-b">
                    {togglePredicted ? mergedGroupedActualAndPredict[productName].total : groupedActual[productName].total}
                  </td>
                  <td className="py-2 px-4 border-b">items</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NumberOfProducts;
