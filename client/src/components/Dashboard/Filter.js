import React, { useRef, useState } from "react";

const DropdownFilter = ({ products, selectedProduct, onSelectProduct }) => {
    console.log(`In Fliter products ==> ${products}`)
    console.log(`In Fliter selected ==> ${selectedProduct}`)
    return (
      <select value={selectedProduct} onChange={(e) => onSelectProduct(e.target.value)}>
        <option value="">Select a product...</option>
        {products.map((product) => (
          <option key={product} value={product}>
            {product}
          </option>
        ))}
      </select>
    );
  };
  
  export default DropdownFilter;