import React, { useRef, useState } from "react";

const Analyzed = ({predictedName, predictedData, userData, actualData, togglePredicted}) => {
  // console.log( `Analyze Phase Predicted Data: ${predictedData}`)
  // console.log( `Analyze Phase Actual Data: ${actualData}`)
  // console.log( `Analyze Phase user Data: ${userData}`)
  console.log( `Analyze Phase toggle: ${togglePredicted}`)
  
  const leadTime = userData.leadTime
  let ROPActual = 0
  let ROPActualAndPredicted = 0
  console.log( `Lead Time: ${leadTime}`)

  // const mergeData = (actualData, quantityData) => {
  //   return actualData.map(saleItem => {
  //     const matchingQuantityItem = quantityData.find(quantityItem => {
  //       const saleDate = new Date(saleItem.Date._seconds * 1000);
  //       const quantityDate = new Date(quantityItem.Date._seconds * 1000);
  //       return saleDate.getMonth() === quantityDate.getMonth() && saleDate.getFullYear() === quantityDate.getFullYear();
  //     });
  
  //     return {
  //       ...saleItem,
  //       Predicted_quantity: matchingQuantityItem ? matchingQuantityItem.Predicted_quantity : null
  //     };
  //   });
  // };

  const inventoryROP = (actualData,predictedData) => { 
    console.log(`------ Inventory Analyze -----`)
    const predictedQty = predictedData.map(item => Math.round(item.Predicted_quantity));
    const actualQty = actualData.map(item => item.quantity);
    const combinedQty = predictedQty.concat(actualQty);
    const sumActual = actualQty.reduce((acc, currentValue) => acc + currentValue, 0)
    const actualDemandRate = sumActual/actualQty.length;
    const sumPredicted = predictedQty.reduce((acc, currentValue) => acc + currentValue, 0)
    const predictedDemandRate = sumPredicted/predictedQty.length;
    const maxCombinedQty = Math.max(...combinedQty);
    const maxActualQty = Math.max(...actualQty)

    const avgActualAndPredicted = (actualDemandRate+predictedDemandRate)
    const safetyStockActual = (leadTime*maxActualQty)-(leadTime*actualDemandRate)
    const safetyStockActualAndPredicted = (leadTime*maxCombinedQty)-(leadTime*avgActualAndPredicted)
    ROPActual = Math.round((leadTime*actualDemandRate) + safetyStockActual)
    ROPActualAndPredicted = Math.round((leadTime*(actualDemandRate+predictedDemandRate)) + safetyStockActualAndPredicted)

    console.log(`actualDemandRate :${actualDemandRate}`)
    console.log(`predictedDemandRate :${predictedDemandRate}`)
    console.log(`maxCombinedQty :${maxCombinedQty}`)
    console.log(`maxActualQty :${maxActualQty}`)

    console.log(`avgActualAndPredicted :${avgActualAndPredicted}`)
    console.log(`safetyStockActual :${safetyStockActual}`)
    console.log(`safetyStockActualAndPredicted :${safetyStockActualAndPredicted}`)
    console.log(`ROPActual :${ROPActual}`)
    console.log(`ROPActualAndPredicted :${ROPActualAndPredicted}`)
  }

  const salesAnalyze = (actualData,predictedData) => {
    console.log(`------ Sales Analyze -----`)



  }
  predictedName === "Predicted Quantity" ? inventoryROP(actualData,predictedData) : salesAnalyze(actualData,predictedData)// need to support function toggle include predict

  return (
    <div className="w-full">
      {predictedName === "Predicted Quantity" ? (
          <div>
            <p className="pb-4">Reorder point</p>
            <p className="text-base"> 
              {/* need to support function toggle include predict */}
              while your products are <span style={{ color: '#B62000', fontWeight: 'bold' }}>{togglePredicted === true? ROPActualAndPredicted:ROPActual}</span> items in stock. 
            </p>
          </div>
        ) : (
          <div>
            <p className="pb-4">Analyze Sales</p>
            <p className="text-base"> 
              {/* need to support function toggle include predict */}
              ยอดขายอาจ ... ... ในช่วงเดือน ...
            </p>
          </div>
        )}
    </div>
  );
};

export default Analyzed;
