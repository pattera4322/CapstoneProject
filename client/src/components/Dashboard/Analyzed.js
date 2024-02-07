import React, { useRef, useState } from "react";

const Analyzed = ({predictedData, userData, actualData, analyzedType}) => {
  // console.log( `Analyze Phase Predicted Data: ${predictedData}`)
  // console.log( `Analyze Phase Actual Data: ${actualData}`)
  // console.log( `Analyze Phase user Data: ${userData}`)
  // console.log( `Analyze Phase type: ${analyzedType}`) // 1 = Retail Sales , 2 = Inventory
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
  inventoryROP(actualData,predictedData) // need to support function toggle include predict

  return (
    <div className="w-full">
      <p className="pb-4">Reorder point</p>
      <p className="text-base"> 
      {/* need to support function toggle include predict */}
        while your products are <span style={{ color: 'red', fontWeight: 'bold' }}>{ROPActual}</span> items in stock. 
      </p>
    </div>
  );
};

export default Analyzed;
