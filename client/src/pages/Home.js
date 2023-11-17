import React, { useEffect, useState, useRef } from "react";

import "../index.css";
import StepperSection from "../components/Home/Stepper";

function HomePage() {
  const StepSection = useRef(null);
  const scrolldown = () => {
    StepSection.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="pt-24">
  {/*<------------------------------ Section 1 Introduce web application ------------------------------> */}
  <div className="mt-10 text-center px-4 sm:px-8">
    <h1 className="text-4xl sm:text-5xl font-bold">
      Step into a Smarter Retail Experience!
    </h1>
    <div className="text-lg sm:text-xl mt-6">
      <p>Maximize the potential of your workforce by automating</p>
      <p>complex tasks and optimizing workflows with our</p>
      <p>predictive stocking data.</p>
    </div>
    <div className="pt-8 sm:pt-10 pb-10 bg-no-repeat bg-bottom bg-auto">
      <button
        onClick={scrolldown}
        className="text-lg sm:text-xl hover:bg-orange-100 text-black border-2 border-black rounded-full px-6 sm:px-10 py-3 sm:py-4"
      >
        Let’s get started!
      </button>
    </div>
  </div>
  <img
    src="/assets/Openedbox.svg"
    alt="open box"
    className="mx-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
  />

  {/*<------------------------------ Section 2 Stepper------------------------------> */}

  <div className="importSection pr-4 pl-4 sm:pr-20 sm:pl-20" ref={StepSection}>
    <StepperSection />
  </div>
</div>
  );
}

export default HomePage;
