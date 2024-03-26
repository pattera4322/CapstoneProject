import React, { useEffect, useState } from "react";
import InfoPopup from "../../components/Home/InfoPopup";

const Analyzed = ({ predictedName, predictedData, userData, actualData, togglePredicted }) => {

  const leadTime = userData.leadTime === 0? 1 : userData.leadTime
  const costPerOrder = userData.costPerOrder === 0? 1 : userData.costPerOrder
  const costPerProductStorage = userData.costPerProductStorage === 0? 1 : userData.costPerProductStorage
  let ROPActual = 0
  let ROPActualAndPredicted = 0
  let EOQActual = 0
  let EOQActualAndPredicted = 0
  let analyzedSalesWithComparison = []

  const inventoryROP = (actualData, predictedData) => {
    const predictedQty = predictedData.map(item => Math.round(item.Predicted_quantity));
    const actualQty = actualData.map(item => item.quantity);
    const combinedQty = predictedQty.concat(actualQty);
    const sumActual = actualQty.reduce((acc, currentValue) => acc + currentValue, 0)
    const actualDemandRate = sumActual / actualQty.length;
    const sumPredicted = predictedQty.reduce((acc, currentValue) => acc + currentValue, 0)
    const predictedDemandRate = sumPredicted / predictedQty.length;
    const maxCombinedQty = Math.max(...combinedQty);
    const maxActualQty = Math.max(...actualQty)

    const avgActualAndPredicted = (actualDemandRate + predictedDemandRate)
    const safetyStockActual = (leadTime * maxActualQty) - (leadTime * actualDemandRate)
    const safetyStockActualAndPredicted = (leadTime * maxCombinedQty) - (leadTime * avgActualAndPredicted)
    ROPActual = Math.round((leadTime * actualDemandRate) + safetyStockActual)
    ROPActualAndPredicted = Math.round((leadTime * (actualDemandRate + predictedDemandRate)) + safetyStockActualAndPredicted)
    // EOQActual = Math.round(Math.sqrt((2 * actualDemandRate * costPerOrder) / (costPerProductStorage / actualDemandRate)))
    EOQActual = Math.round(Math.sqrt((2 * actualDemandRate * costPerOrder) / (costPerProductStorage / sumActual)))
    // EOQActualAndPredicted = Math.round(Math.sqrt((2 * (actualDemandRate + predictedDemandRate) * costPerOrder) / (costPerProductStorage / (actualDemandRate + predictedDemandRate))))
    EOQActualAndPredicted = Math.round(Math.sqrt((2 * (actualDemandRate + predictedDemandRate) * costPerOrder) / (costPerProductStorage / (sumActual+sumPredicted))))
  }

  const salesAnalyze = (actualData, predictedData) => {
    const renamedActualData = actualData.map(item => ({
      date: item.date,
      product: item.productName,
      totalSales: item.totalSales
    }));

    const renamedAnalyzedSalesData = predictedData.map(item => ({
      date: item.date,
      product: item.Product,
      totalSales: item.Predicted_totalSales
    }));

    const actualDataGroupedByMonth = renamedActualData.reduce((acc, curr) => {
      // const date = new Date(curr.date * 1000);
      // const year = date.getFullYear();
      // const month = date.getMonth() + 1;
      const dateParts = curr.date.split('-');
      const year = dateParts[2];
      const month = dateParts[1];

      const key = `${year}-${month}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {});

    const analyzedDataGroupedByMonth = renamedAnalyzedSalesData.reduce((acc, curr) => {
      // const date = new Date(curr.date * 1000);
      // const year = date.getFullYear();
      // const month = date.getMonth() + 1;
      const dateParts = curr.date.split('-');
      const year = dateParts[2];
      const month = dateParts[1];

      const key = `${year}-${month}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {});

    const salesByMonth = (tableName, groupedByMonth) => {
      tableName = Object.entries(groupedByMonth).map(([key, value]) => ({
        Month: key,
        Product: value[0].product,
        TotalSales: value.reduce((acc, curr) => acc + curr.totalSales, 0)
      }));
      return tableName
    }
    const actualSalesByMonth = salesByMonth("actualSalesByMonth", actualDataGroupedByMonth)
    const analyzedSalesByMonth = salesByMonth("analyzedSalesByMonth", analyzedDataGroupedByMonth)
    console.log("analyze wtf", analyzedDataGroupedByMonth)
    console.log("analyze a rai wa", analyzedSalesByMonth)

    const calculatePercentageAndTrend = (currentMonth, lastMonth) => {
      if (lastMonth === 0) return { percent: 0, trend: 'unchanged' };
      const percentChange = ((currentMonth - lastMonth) / lastMonth) * 100;
      const trend = percentChange > 0 ? 'increase' : percentChange < 0 ? 'decrease' : 'unchanged';
      return { percent: percentChange.toFixed(2), trend };
    };

    // Calculate percent change and trend for each month
    analyzedSalesWithComparison = analyzedSalesByMonth.map((currentMonth, index) => {
      const lastMonth = index === 0 ? (actualSalesByMonth[actualSalesByMonth.length - 1].Month === currentMonth.Month ? actualSalesByMonth[actualSalesByMonth.length - 2].TotalSales : actualSalesByMonth[actualSalesByMonth.length - 1].TotalSales) : analyzedSalesByMonth[index - 1].TotalSales;
      const { percent, trend } = calculatePercentageAndTrend(currentMonth.TotalSales, lastMonth);
      return { ...currentMonth, Percent: percent, Trend: trend };
    });
  }

  const getMonthName = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long' });
  }

  predictedName === "Predicted Quantity" ? inventoryROP(actualData, predictedData) : salesAnalyze(actualData, predictedData)
  const infoAnalyze = "This visualization illustrates the percentage of changes in trends and movement between the previous and current month's prediction data.";
  const infoROP = `The estimated Reorder Point signifies the minimum stock level for ordering new goods to prevent stockouts. It's calculated as the product of lead time and demand rate, plus safety stock.`;
  const infoEOQ = `The estimated economic order quantity optimizes inventory costs while ensuring product availability. It's calculated from holding cost, ordering cost, and demand rate using the square root of (2 * Demand Rate * ordering cost) divided by (holding cost per unit)`;

  const getTextColor = (trend) => {
    if (trend === 'increase') {
      return '#5EB8FF';
    } else if (trend === 'decrease') {
      return '#FF5F3C';
    } else {
      return '#000000'; // default color
    }
  };

  return (
    <div className="">
      {predictedName === "Predicted Quantity" ? (
        <div>
          <div className="pb-2">
            <label className="pb-4 font-bold">Reorder point</label>
            <InfoPopup infoText={infoROP}/>
          </div>
          <p className="text-base">
            while your products are <span style={{ color: '#5EB8FF', fontWeight: 'bold' }}>{togglePredicted === true ? ROPActualAndPredicted : ROPActual}</span> items in stock.
          </p>
          <br />
          <div className="pb-2">
            <label className="pb-4 font-bold">Economic Order Quantity</label>
            <InfoPopup infoText={infoEOQ}/>
          </div>
          <p className="text-base">
            The Economic Order Quantity (EOQ) that maximizes cost-effectiveness and efficiency is <span style={{ color: '#5EB8FF', fontWeight: 'bold' }}>{togglePredicted === true ? EOQActualAndPredicted : EOQActual}</span> items in order.
          </p>
        </div>
      ) : (
        <div>
          <div className="pb-2">
            <label className="pb-4 font-bold">Analyze Sales</label>
            <InfoPopup infoText={infoAnalyze}/>
          </div>
          In case sales follow an anticipated trend, The sales volume may&nbsp;
          {analyzedSalesWithComparison && analyzedSalesWithComparison.map((item) => (
            item.Trend !== "unchanged" ? (
              <div key={item.Month}>
                <div style={{ color: getTextColor(item.Trend), display: 'inline-block' }}>
                  {item.Trend}
                </ div>
                &nbsp;by&nbsp;
                <div style={{ color: getTextColor(item.Trend), display: 'inline-block' }}>
                  {item.Percent} %&nbsp;
                </ div>
                during {getMonthName(item.Month)}
              </div>
            ) : (
              <div key={item.Month}>
                This visualization needs to use prediction data.
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Analyzed;
