import React from "react";
import { Button } from "@material-tailwind/react";
import StepperSection from "../components/Home/Stepper";

const Popup = ({
  onClose,
  header,
  info = "",
  onContinue,
  continueText = "Confirm",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
      <div className="z-50 bg-white p-8 rounded-md shadow-lg flex flex-col w-96">
        <div className="mb-4 text-s text-gray-500 text-left">
          <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            {header}
          </h3>
          <p>{info}</p>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            id="close-modal"
            type="button"
            className="mr-2 bg-gray-300 text-black"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={onContinue}>{continueText}</Button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
