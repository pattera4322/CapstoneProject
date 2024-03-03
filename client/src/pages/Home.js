import React, { useEffect, useState, useRef } from "react";

import "../index.css";
import StepperSection from "../components/Home/Stepper";
import DetailSection from "../components/Home/DetailSection";

function HomePage() {
  const StepSection = useRef(null);
  const [toggleIn, setToggleIn] = useState(false);

  const scrolldown = () => {
    StepSection.current?.scrollIntoView({ behavior: "smooth" });
  };
  const toggleInstruction = () => {
    setToggleIn(!toggleIn);

  }

  return (
    <div className="pt-24 grid grid-cols-2 gap-4 content-center">
      {/*<------------------------------ Section 1 Introduce web application ------------------------------> */}
      {/* <div className="mt-10 text-center px-4 sm:px-8 col-span-3"> */}
      <div className="mt-10 text-left px-4 sm:px-8 col-span-1 ml-20">
        <h1 className="text-6xl sm:text-6xl font-bold">
          Step into a Smarter Retail Experience!
        </h1>
        <div className="text-lg sm:text-lg mt-6 text-left">
          <p>Maximize the potential of your workforce by automating</p>
          <p>complex tasks and optimizing workflows with our</p>
          <p>predictive stocking data.</p>
        </div>
        <div className="pt-8 sm:pt-10 pb-10 bg-no-repeat bg-bottom bg-auto">
          {/* <button
            onClick={scrolldown}
            className="text-lg sm:text-xl hover:bg-orange-100 text-black border-2 border-black rounded-full px-6 sm:px-10 py-3 sm:py-4"
          >
            Let’s get started!
          </button> */}
          {/* <button
            onClick={toggleInstruction}
            className="relative inline-flex items-center justify-center p-0.5 mr-10 mb-2 me-2 overflow-hidden text-lg font-medium text-gray-900 rounded-full group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
          >
            <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0">
              Read Instructions
            </span>
          </button>
          <button
            onClick={scrolldown}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-lg font-medium text-gray-900 rounded-full group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
          >
            <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0">
              Let’s get started
            </span>
          </button> */}
          <button
            onClick={toggleInstruction}
            className="relative inline-flex items-center justify-center p-0.5 mr-10 mb-2 me-2 overflow-hidden text-lg font-medium text-gray-900 rounded-full group bg-[#0068D2]"
          >
            <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0 group-hover:text-white">
              Read Instructions
            </span>
          </button>
          <button
            onClick={scrolldown}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-lg font-medium text-gray-900 rounded-full group bg-[#0068D2]"
          >
            <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0 group-hover:text-white">
              Let’s get started
            </span>
          </button>
        </div>
      </div>
      {/* <div className="mt-24 mb-24 h-56 grid grid-cols-3 gap-4 content-center "> */} 
      {/* <div className={` grid grid-cols-subgrid gap-4 h-33  ${toggleIn ? "col-span-2 transition-transform -translate-x-10 duration-1000" : 'col-span-3 transition-transform translate-x-0 duration-1000'}`}> */}
      {
        !toggleIn ? (
          <div className={`grid grid-cols-subgrid h-33 col-span-1 transition-transform translate-x-0 duration-1000`}>
            <img
              src={process.env.PUBLIC_URL + "/assets/SmartStockHomeBG.svg"}
              alt="SmartStock Home Image"
              className="mx-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
            />
          </div>
        ) : null
      }
      {/* <div className={` grid grid-cols-subgrid gap-4 h-33  ${toggleIn ? "col-span-2 transition-transform -translate-x-10 duration-1000" : 'col-span-1 transition-transform translate-x-0 duration-1000'}`}>
        <img
          src={process.env.PUBLIC_URL + "/assets/SmartStockHomeBG.svg"}
          alt="open box"
          className="mx-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
        />
      </div> */}
      {
        toggleIn ? (
          <div className={`pl-0 pr-24 pt-24 opacity-100 transition-opacity duration-1000`}>
            { toggleIn && <DetailSection/>}
          </div>
        ) : null
      }
      

      {/*<------------------------------ Section 2 Stepper------------------------------> */}

      <div
        className="importSection pr-4 pl-4 sm:pr-20 sm:pl-20 grid grid-cols-subgrid gap-4 col-span-3"
        ref={StepSection}
      >
        <StepperSection />
      </div>
    </div>
  );
}

export default HomePage;
