import React, { useRef, useState } from "react";

const DropdownFilter = ({ products, selectedProduct, onSelectProduct }) => {
  return (
    <div>
      <select
        className="bg-white divide-y divide-gray-100 rounded-md w-32 h-7 dark:bg-gray-700 text-black text-base text-gray-700 dark:text-gray-200 border border-gray-300"
        value={selectedProduct}
        onChange={(e) => onSelectProduct(e.target.value)}
      >
        <option value="">All products</option>
        {products.map((product) => (
          <option
            key={product}
            value={product}
          >
            {product}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownFilter;
