import React, { useRef, useState } from "react";

const Analyzed = ({predictedData, userData, analyzedType}) => {
  console.log( `Analyze Predicted Data: ${predictedData}`)
  console.log( `Analyze user Data: ${userData}`)
  console.log( `Analyze type: ${analyzedType}`) // 1 = Retail Sales , 2 = Inventory

  // const 

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
