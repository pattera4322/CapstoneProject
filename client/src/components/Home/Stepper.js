import { useState } from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import UploadFileSection from "./UploadFileSection";
import AskingSection from "./AskingSection";
import AnalyzeSection from "./AnalyzeSection";
import Popup from "../Popup.js";
import DownloadTemplate from "./DownloadTemplate";
import { NavLink } from "react-router-dom";

const StepperSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [fileId, setFileId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showAskPopup, setShowAskPopup] = useState(false);

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

  const handleSubmit = (formData) => {
    console.log("Form data submitted:", formData);
  };

  const receiveFileData = (data, fileId) => {
    setFileData(data);
    setFileId(fileId);
  };

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleContinueToNextStep = () => {
    setShowPopup(false);
    setShowAskPopup(false);
    handleNavigation("next");
  };

  const handleSubmitAskingSection = (formData) => {
    // Add validation for sales goal
    if (formData.salesGoal === 0) {
      setShowPopup(true); // Show the popup with an error message
      return; // Prevent navigation
    }
    // If sales goal is valid, proceed to the next step
    handleNavigation("next");
  };

  const handleLogIn = () => {
    if (localStorage.getItem("user") === null) {
      setShowAskPopup(true);
    } else {
      handleNavigation("next");
    }
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
        {/* {activeStep === 0 && <AskingSection onSubmit={handleSubmit} />} */}
        {activeStep === 0 && (
          <AskingSection onSubmit={handleSubmitAskingSection} />
        )}
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
            We will redirect you to the status page to view the success of your
            analysis process. This page will display the job currently in the
            queue.
          </div>
        ) : (
          <div className="flex">
            <Button
              onClick={() => {
                if (activeStep === 0) {
                  handleButtonClick();
                } else if (activeStep === 2) {
                  handleButtonClick();
                } else if (activeStep === 1) {
                  handleLogIn();
                } else {
                  handleNavigation("next");
                }
              }}
              disabled={activeStep === 2 ? fileData === null : false}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          header={
            activeStep === 0
              ? "Review Your Information"
              : "Before go to analyze!"
          }
          info={
            activeStep === 0
              ? "The data you input can be edited on the dashboard. Once you've analysed a file, you don't need to come back and change information here."
              : "Please ensure that you have reviewed and confirmed the information in the selected column before proceeding. Note that changes cannot be undone. Take a moment to double-check before clicking the 'Go' button"
          }
          onContinue={handleContinueToNextStep}
          continueText={activeStep === 0 ? "Confirm" : "Go to Analyze ->"}
        />
      )}

      {showAskPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          header={"Please Login before analyze your data!"}
          info={"Before analyzing, we would like you to join us."}
          onContinue={handleContinueToNextStep}
          continueText={<NavLink to="/Login">Go to join us!</NavLink>}
        />
      )}
    </div>
  );
};

export default StepperSection;
