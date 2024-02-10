import { Switch, Typography } from "@material-tailwind/react";
import React, { useState } from 'react';

 
const TogglePrediction = ({ label, defaultChecked, onToggle }) => {

  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onToggle(!isChecked);
  };

  return (
    <Switch
      label={
        <div>
          <Typography color="blue-gray" className="font-medium">
            {label}
          </Typography>
          {/* <Typography variant="small" color="gray" className="font-normal">
            You&apos;ll be able to login without password for 24 hours.
          </Typography> */}
        </div>
      }
      containerProps={{
        className: "-mt-5",
      }}
      checked={isChecked}
      onChange={handleToggle} 
    />
  );
}

export default TogglePrediction;