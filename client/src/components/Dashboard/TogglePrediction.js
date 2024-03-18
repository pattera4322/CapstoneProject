import { useState } from "react";
import "./TogglePrediction.css";

const TogglePrediction = ({ label, defaultChecked, onToggle }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    onToggle(newState);
  };

  return (
    <div class="checkbox-wrapper-35">
      <input
        value="private"
        name="switch"
        id="switch"
        type="checkbox"
        class="switch"
        checked={isChecked}
        onChange={handleToggle}
      />
      <label for="switch">
        <span class="switch-x-text">Prediction is </span>
        <span class="switch-x-toggletext">
          <span class="switch-x-unchecked">
            <span class="switch-x-hiddenlabel">Unchecked: </span>Off
          </span>
          <span class="switch-x-checked">
            <span class="switch-x-hiddenlabel">Checked: </span>On
          </span>
        </span>
      </label>
    </div>
  );
};

export default TogglePrediction;
