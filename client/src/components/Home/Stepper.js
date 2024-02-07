import { useState } from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

import UploadFileSection from "./UploadFileSection";
import AskingSection from "./AskingSection";
import AnalyzeSection from "./AnalyzeSection";
import Popup from "../Popup.js";
import DownloadTemplate from "./DownloadTemplate";

const StepperSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [fileId, setFileId] = useState("");

  const steps = [
    "Question",
    "Download Template",
    "Upload data",
    "Analyzing Data",
  ];

  const handleNavigation = (direction) => {
    const nextStep = direction === "next" ? activeStep + 1 : activeStep - 1;
    setShowPopup(false);
    setActiveStep(nextStep);
    setIsLastStep(nextStep === steps.length - 1);
    setIsFirstStep(nextStep === 0);
  };

  const handleAnalyze = () => {};

  const handleSubmit = (formData) => {
    console.log("Form data submitted:", formData);
  };

  const receiveFileData = (data, fileId) => {
    console.log("Data received from Select DATA:", data);
    console.log("Data received from file name:", fileId);
    setFileData(data);
    setFileId(fileId);
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleButtonClick = () => {
    setShowPopup(true);
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
        {activeStep === 0 && <AskingSection onSubmit={handleSubmit} />}
        {activeStep === 1 && <DownloadTemplate />}
        {activeStep === 2 && (
          <UploadFileSection sendfileData={receiveFileData} />
        )}
        {activeStep === 3 && <AnalyzeSection fileId={fileId} />}
      </div>

      {/* <---------------------- Button Section --------------------> */}
      <div className="mt-16 inline-flex">
        {!isFirstStep && !isLastStep && (
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
            {/* TODO: some progress bar in future */}
            We will redirect you to the status page to view the success of your analysis process. This page will display the job currently in the queue.
          </div>
        ) : (
          <div className="flex">
            <Button
              onClick={() => {
                if (activeStep === 2) {
                  handleButtonClick();
                } else {
                  handleNavigation("next");
                }
              }}
              disabled={activeStep === 2? fileData === null:false}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Popup component */}
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          header={"Before go to analyze!"}
          info={
            "Please ensure that you have reviewed and confirmed the information in the selected column before proceeding. Note that changes cannot be undone. Take a moment to double-check before clicking the 'Go' button"
          }
          onContinue={() => handleNavigation("next")}
          continueText={"Go to Analyze ->"}
        />
      )}
    </div>
  );
};

export default StepperSection;
