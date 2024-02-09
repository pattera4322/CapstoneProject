import { Switch, Typography } from "@material-tailwind/react";
 
const TogglePrediction = ({onTogglePrediction}) => {
  console.log(`In Fliter products ==> ${onTogglePrediction}`)
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
      onClick={onTogglePrediction()}
    />
  );
}

export default TogglePrediction;