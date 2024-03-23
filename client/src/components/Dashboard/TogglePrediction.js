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
    <div className="checkbox-wrapper-35">
      <input
        value="private"
        name="switch"
        id="switch"
        type="checkbox"
        className="switch"
        checked={isChecked}
        onChange={handleToggle}
      />
      <label htmlFor="switch">
        <span className="switch-x-text">Prediction is </span>
        <span className="switch-x-toggletext">
          <span className="switch-x-unchecked">
            <span className="switch-x-hiddenlabel">Unchecked: </span>Off
          </span>
          <span className="switch-x-checked">
            <span className="switch-x-hiddenlabel">Checked: </span>On
          </span>
        </span>
      </label>
    </div>
  );
};

export default TogglePrediction;
