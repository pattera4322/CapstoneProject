import React, { useRef, useState } from "react";

const Analyzed = ({predictedData, userData, actualData, analyzedType}) => {
  console.log( `Analyze Predicted Data: ${predictedData}`)
  console.log( `Analyze user Data: ${userData}`)
  console.log( `Analyze type: ${analyzedType}`) // 1 = Retail Sales , 2 = Inventory

  // const leadTime = userData.leadTime


  // // Reorder point = (lead time x demand rate) + safety stock
  // // demand rate = average(all actual qty) and average(all actual qty + predict qty)
  // // Safety Stock = (Lead Time max x Demand max) – (Lead Time  avg x Demand avg) or Safety Stock = Z x √LTavg x σD(Demand standard deviation)
  // const inventoryROP = (actualData,predictedData) => { //predictedData is a array of qty
  //   const initialValue = 0;
  //   const sumActualDemandRate = actualData.reduce(
  //     (accumulator, currentValue) => accumulator + currentValue,
  //     initialValue,
  //   );
  //   const sumPredictedDemandRate = predictedData.reduce(
  //     (accumulator, currentValue) => accumulator + currentValue,
  //     initialValue,
  //   );
  //   // Find the maximum value of Predicted_quantity
  //   const maxPredictedQty = predictedQuantityValues.reduce((max, currentValue) => {
  //     return Math.max(max, currentValue.Predicted_quantity);
  //   }, Number.NEGATIVE_INFINITY);

  //   const avgActual = sumActualDemandRate/actualData.length

  //   const safetyStockActual = (leadTime*maxPredictedQty)-(leadTime*avgActual)
  //}

  return (
    <div className="w-full">
      <p className="pb-4">Analyze data</p>
      <p className="text-base">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </div>
  );
};

export default Analyzed;
