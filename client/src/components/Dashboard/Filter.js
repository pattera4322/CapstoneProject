import React, { useRef, useState } from "react";

const DropdownFilter = ({ products, selectedProduct, onSelectProduct }) => {
    console.log(`In Fliter products ==> ${products}`)
    console.log(`In Fliter selected ==> ${selectedProduct}`)
    return (
      <div className="bg-white divide-y divide-gray-100 rounded-md shadow w-32 dark:bg-gray-700">
      <select value={selectedProduct} onChange={(e) => onSelectProduct(e.target.value)}>
        <option value="">All products</option>
        {products.map((product) => (
          <option key={product} value={product}>
            {product}
          </option>
        ))}
      </select>
      </ div>
    );
  };
  
  export default DropdownFilter;