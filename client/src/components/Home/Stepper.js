import { useRef, useState, useEffect } from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

import SelectData from "./SelectData";
import Asking from "./Asking";
import Analyzing from "./Analyzing";

const StepperSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);

  const steps = ["Question", "Import & Select data", "Analyzing Data"];

  const handleNavigation = (direction) => {
    const nextStep = direction === "next" ? activeStep + 1 : activeStep - 1;
    setActiveStep(nextStep);
    setIsLastStep(nextStep === steps.length - 1);
    setIsFirstStep(nextStep === 0);
  };

  const handleAnalyze = () => {};

  const handleSubmit = (formData) => {
    // You can do something with the form data here
    console.log("Form data submitted:", formData);
    // For example, navigate to another page with the form data
    // You can use React Router for navigation or pass the data as props to another component
    // Example using React Router:
    // history.push('/anotherpage', formData);
  };

  return (
    <div className="w-full py-4 px-8 mt-7">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        {steps.map((label, index) => (
          <Step key={index}>
            {index + 1}
            <div className="absolute -bottom-[2.5rem] w-max text-center">
              <Typography
                variant="h6"
                color={activeStep === index ? "blue-gray" : "gray"}
              >
                {label}
              </Typography>
            </div>
          </Step>
        ))}
      </Stepper>
      {/* <---------------------- Detail Section --------------------> */}
      <div className="mt-20 ">
        {activeStep === 0 && <Asking onSubmit={handleSubmit} />}
        {activeStep === 1 && <SelectData />}
        {activeStep === 2 && <Analyzing />}
      </div>

      {/* <---------------------- Button Section --------------------> */}
      <div className="mt-16 inline-flex">
        {!isFirstStep && (
          <div className="flex pr-4">
            <Button
              onClick={() => handleNavigation("prev")}
              disabled={isFirstStep}
            >
              Prev
            </Button>
          </div>
        )}

        {isLastStep ? (
          <div className="flex">
            <NavLink to="/Dashboard">
              <Button onClick={handleNavigation}>Go To Dashboard!</Button>
            </NavLink>
          </div>
        ) : (
          <div className="flex">
            <Button
              onClick={() => handleNavigation("next")}
              disabled={isLastStep}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepperSection;
