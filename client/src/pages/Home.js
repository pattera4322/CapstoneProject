import React, { useEffect, useState, useRef } from "react";

import "../index.css";
import StepperSection from "../components/Home/Stepper";

function HomePage() {
  const StepSection = useRef(null);
  const scrolldown = () => {
    StepSection.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div class="pt-24">
      {/*<------------------------------ Section 1 Introduce web application ------------------------------> */}
      <div className="mt-10">
        <h1 className="text-4xl font-bold">
          Step into a Smarter Retail Experience!
        </h1>
        <div className="text-xl mt-10">
          <p>Maximize the potential of your workforce by automating</p>
          <p>complexing tasks and optimizing workflows with our</p>
          <p>predictive stocking data.</p>
        </div>
        {/* <div className="pt-60 pb-60 bg-no-repeat bg-bottom bg-auto" style={{ backgroundImage: 'url("/assets/Openedbox.svg")' }}> */}
        <div className="pt-10 pb-10 bg-no-repeat bg-bottom bg-auto">
          <button
            onClick={scrolldown}
            class="text-xl hover:bg-orange-100 text-black border-2 border-black rounded-full px-10 py-4"
          >
            Let’s get start!
          </button>
        </div>
      </div>
      <img src="/assets/Openedbox.svg" alt="open box" width={3500} />

      {/*<------------------------------ Section 2 Stepper------------------------------> */}

      <div class="importSection pr-20 pl-20" ref={StepSection}>
        <StepperSection />
      </div>
    </div>
  );
}

export default HomePage;
