import React, { useEffect, useState } from "react";

const Analyzed = ({predictedName, predictedData, userData, actualData, togglePredicted}) => {
  // console.log( `Analyze Phase Predicted Data: ${predictedData}`)
  // console.log( `Analyze Phase Actual Data: ${actualData}`)
  // console.log( `Analyze Phase user Data: ${userData}`)
  console.log( `Analyze Phase toggle: ${togglePredicted}`)
  
  const leadTime = userData.leadTime
  let ROPActual = 0
  let ROPActualAndPredicted = 0
  let analyzedSalesWithComparison = []
  console.log( `Lead Time: ${leadTime}`)

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
    const renamedActualData = actualData.map(item => ({
      date: item.date._seconds,
      product: item.productName,
      totalSales: item.totalSales
    }));

    const renamedAnalyzedSalesData = predictedData.map(item => ({
      date: item.Date._seconds,
      product: item.Product,
      totalSales: item.Predicted_totalSales
    }));

    const actualDataGroupedByMonth = renamedActualData.reduce((acc, curr) => {
      const date = new Date(curr.date * 1000);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const key = `${year}-${month}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {});

    const analyzedDataGroupedByMonth = renamedAnalyzedSalesData.reduce((acc, curr) => {
      const date = new Date(curr.date * 1000);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const key = `${year}-${month}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {});

    const salesByMonth = (tableName,groupedByMonth) => {
      tableName = Object.entries(groupedByMonth).map(([key, value]) => ({
        Month: key,
        Product: value[0].product,
        TotalSales: value.reduce((acc, curr) => acc + curr.totalSales, 0)
      }));
      return tableName
    }
    const actualSalesByMonth = salesByMonth("actualSalesByMonth",actualDataGroupedByMonth)
    const analyzedSalesByMonth = salesByMonth("analyzedSalesByMonth",analyzedDataGroupedByMonth)

    const calculatePercentageAndTrend = (currentMonth, lastMonth) => {
      if (lastMonth === 0) return { percent: 0, trend: 'unchanged' };
      const percentChange = ((currentMonth - lastMonth) / lastMonth) * 100;
      const trend = percentChange > 0 ? 'พุ่งขึ้น' : percentChange < 0 ? 'ลดลง' : 'ไม่เปลี่ยนแปลง';
      return { percent: percentChange.toFixed(2), trend };
    };
    
    // Calculate percent change and trend for each month
    analyzedSalesWithComparison = analyzedSalesByMonth.map((currentMonth, index) => {
      const lastMonth = index === 0 ? (actualSalesByMonth[actualSalesByMonth.length - 1].Month === currentMonth.Month? actualSalesByMonth[actualSalesByMonth.length - 2].TotalSales : actualSalesByMonth[actualSalesByMonth.length - 1].TotalSales) : analyzedSalesByMonth[index - 1].TotalSales;
      const { percent, trend } = calculatePercentageAndTrend(currentMonth.TotalSales, lastMonth);
      return { ...currentMonth, Percent: percent, Trend: trend };
    });
    
    console.log(analyzedSalesWithComparison);
  }

  // useEffect(() => {
  //   if (predictedName === "Predicted Quantity") {
  //     inventoryROP(actualData, predictedData);
  //   } else {
  //     salesAnalyze(actualData, predictedData);
  //   }
  // }, [actualData, predictedData, predictedName]);

  const getMonthName = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', locale: 'th-TH' });
  }

  predictedName === "Predicted Quantity" ? inventoryROP(actualData,predictedData) : salesAnalyze(actualData,predictedData)// need to support function toggle include predict

  return (
    <div className="w-full">
      {predictedName === "Predicted Quantity" ? (
        <div>
          <p className="pb-4">Reorder point</p>
          <p className="text-base"> 
            {/* need to support function toggle include predict */}
            while your products are <span style={{ color: '#B62000', fontWeight: 'bold' }}>{togglePredicted === true ? ROPActualAndPredicted : ROPActual}</span> items in stock. 
          </p>
        </div>
      ) : (
        <div>
          <p className="pb-4">Analyze Sales</p>
          {analyzedSalesWithComparison && analyzedSalesWithComparison.map((item) => (
            item.Trend !== "ไม่เปลี่ยนแปลง" ? (
              <div key={item.Month}>
                หากอนาคตเป็นไปตามผลทำนาย ยอดขายมีแนวโน้มที่จะ {item.Trend} {item.Percent}% ในช่วงเดือน {getMonthName(item.Month)}
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
