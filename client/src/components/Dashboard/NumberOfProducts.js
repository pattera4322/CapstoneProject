import React from "react";

const NumberOfProducts = () => {
  // Dummy data for the table
  const productsData = [
    { productName: "DilDo", numberOfProducts: 100 },
    { productName: "Jimkrapong", numberOfProducts: 69 },
    { productName: "Maid Suit", numberOfProducts: 5 },
    { productName: "Cat", numberOfProducts: 99999999999 },
  ];

  return (
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
            {productsData.map((product, index) => (
              <tr key={index} className={(index + 1) % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="py-2 px-4 border-b">{product.productName}</td>
                <td className="py-2 px-4 border-b">{product.numberOfProducts}</td>
                <td className="py-2 px-4 border-b">items</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NumberOfProducts;
