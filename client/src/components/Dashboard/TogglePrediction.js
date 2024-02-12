import { Switch, Typography, Button } from "@material-tailwind/react";
import React, { useState } from 'react';


const TogglePrediction = ({ label, defaultChecked, onToggle }) => {

  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onToggle(!isChecked);
  };

  const [textState, setTextState] = useState("off");

  const toggleText = () => {
    setTextState((state) => (state === "On" ? "Off" : "On"));
  };

  return (
    <div className="">


      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" class="sr-only peer"
        checked={isChecked}
        onChange={handleToggle}
        />
          <div class="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-black"></div>
          <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Enable Prediction</span>
      </label>


      {/* <Switch label="Enable Prediction"
        checked={isChecked}
        onChange={handleToggle}
        /> */}
    </div>
  );
}

export default TogglePrediction;