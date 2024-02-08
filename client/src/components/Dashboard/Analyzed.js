import React, { useRef, useState } from "react";

const Analyzed = ({predictedName, predictedData, userData, actualData}) => {
  console.log( `Analyze Phase Predicted Data: ${predictedData}`)
  console.log( `Analyze Phase Actual Data: ${actualData}`)
  console.log( `Analyze Phase user Data: ${userData}`)
  
  const leadTime = userData.leadTime
  let ROPActual = 0
  let ROPActualAndPredicted = 0
  console.log( `Lead Time: ${leadTime}`)

  const inventoryROP = (actualData,predictedData) => { //predictedData is a array of qty
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
    console.log(`Sale Analyze kuyyyy`)
  }
  predictedName === "Predicted Quantity" ? inventoryROP(actualData,predictedData) : salesAnalyze(actualData,predictedData)// need to support function toggle include predict

  return (
    <div className="w-full">
      {predictedName === "Predicted Quantity" ? (
          <div>
            <p className="pb-4">Reorder point</p>
            <p className="text-base"> 
              {/* need to support function toggle include predict */}
              while your products are <span style={{ color: 'red', fontWeight: 'bold' }}>{ROPActual}</span> items in stock. 
            </p>
          </div>
        ) : (
          <div>
            <p className="pb-4">Analyze Sales</p>
            <p className="text-base"> 
              {/* need to support function toggle include predict */}
              while your .... 
            </p>
          </div>
        )}
    </div>
  );
};

export default Analyzed;
