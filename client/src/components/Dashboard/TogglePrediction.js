import { Switch, Typography } from "@material-tailwind/react";
import React, { useState } from 'react';

 
const TogglePrediction = ({onTogglePrediction}) => {
  const [isToggled, setIsToggled] = useState(true);
  const handleToggle = () =>{
    onTogglePrediction= !onTogglePrediction
    console.log(`Toggle including prediction to => ${onTogglePrediction}`) // True is include, False is exclude
  }
  return (
    <Switch
      label={
        <div>
          <Typography color="blue-gray" className="font-medium">
            Prediction data
          </Typography>
          {/* <Typography variant="small" color="gray" className="font-normal">
            You&apos;ll be able to login without password for 24 hours.
          </Typography> */}
        </div>
      }
      containerProps={{
        className: "-mt-5",
      }}
      onClick={handleToggle()}
    />
  );
}

export default TogglePrediction;