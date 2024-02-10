import React, { useState, useEffect } from "react";
import { Input, Radio, Typography } from "@material-tailwind/react";
import InfoPopup from "./InfoPopup";

const Asking = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    days: 90,
    salesGoal: 0,
    riskLevel: [0, 0],
    leadTime: 1,
  });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("askingItems"));
    if (items) {
      setFormData(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("askingItems", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    if (name === "riskLevel") {
      const arrayValues = value.split(",").map((e) => parseFloat(e));
      setFormData({
        ...formData,
        riskLevel: arrayValues,
      });
    }
    // else if (name ==="salesGoal") {
    //   salesGoalValidation(e)
    // } 
    else if (name === "leadTime") {
      leadTimeValidation(e);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    console.log(name, value);
  };

  const salesGoalValidation = (event) => {
    const inputValue = event.target.value;
    const moneyRegex = /^\d+(\.\d{1,2})?$/;

    const isValidInput = moneyRegex.test(inputValue);
    if (isValidInput) {
      setFormData({ ...formData, salesGoal: inputValue });
    }
    // setMoneyInput(inputValue);
    // setIsValid(isValidInput);
  };

  //handle if user type more than 366 days
  const leadTimeValidation = (e) => {
    const newValue = parseInt(e.target.value, 10);

    if (!isNaN(newValue) && newValue >= 1 && newValue <= 366) {
      setFormData({ ...formData, leadTime: newValue });
    } else if (newValue > 366) {
      setFormData({ ...formData, leadTime: 366 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    console.log("Form submitted with:", formData);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  
  //   if (formData.riskLevel[0] === 0 && formData.riskLevel[1] === 0) {
  //     alert("Please select your comfort level with stock predictions.");
  //     return;
  //   }
  
  //   onSubmit(formData);
  //   console.log("Form submitted with:", formData);
  // };

  const isChecked = (value) => {
    if (formData.riskLevel == value) {
      return true;
    }
    return false;
  };
  // const isChecked = (value) => {
  //   const selectedRange = value.split(",").map(Number);
  //   return (
  //     formData.riskLevel[0] === selectedRange[0] &&
  //     formData.riskLevel[1] === selectedRange[1]
  //   );
  // };
  
  

  const information1 = "We recommend that you enter the maximum value for the sales you desire.";
  const information2 = "This step will not affect sales predictions. But it will affect the recommended amount for stocking products.";
  const information3 = "Measures how long it takes to complete a process from beginning to end. If you don't know the exact time, you can estimate a nearby time period.";

  return (
    <div className="text-black">
      <h2 className="text-xl pt-10">
        At <b>Smart Stock</b>, we aim to provide you with personalized insights
        and recommendations. To better tailor our services to your needs, please
        provide the following information.
      </h2>
      <div onSubmit={handleSubmit} className="pt-10 text-left">
        <div className="pt-10 pl-10">
          <label className="text-lg">
            1. Please share your current sales goal with us.
          </label><InfoPopup infoText={information1} />
          <p className="text-s text-gray-500 pl-4 pt-1.5">
            Your sales goal is crucial for us to align our strategies and
            recommendations with your specific targets, helping you achieve your
            objectives.
          </p>
          <div className="w-72 pt-4 pl-4 inline-block">
            <Input
              type="number"
              label="Sales Goal"
              // placeholder="Ex. 1000000"
              min={0}
              variant="outlined"
              name="salesGoal"
              value={formData.salesGoal}
              onChange={handleChange}
              className="inline-block float-left"
            />
          </div>
          <span className="inline-block pl-2.5">Baht</span>
        </div>
        <div className="pt-10 pl-10">
          <label className="text-lg">
            2. Please let us know your comfort level when it comes to taking
            risks with stock predictions.
          </label><InfoPopup infoText={information2} />
          <p className="text-s text-gray-500 pl-4 pt-1.5">
            Knowing your risk tolerance enables us to provide stock predictions
            that match your investment preferences, ensuring a more tailored and
            suitable experience for you.
          </p>
          <div className="gap-10 pt-3.5">
            <Radio
              name="riskLevel"
              checked={isChecked("0,25")}
              label={
                <Typography
                  color="green"
                  className="flex font-medium green-500"
                >
                  Low
                  <Typography
                    as="a"
                    href="#"
                    color="blue-gray"
                    className="hover:text-blueg-gray-900 font-medium transition-colors"
                  >
                    : 0-25%
                  </Typography>
                </Typography>
              }
              value={[0, 25]}
              onChange={handleChange}
              ripple={true}
            />
            <div className="pl-12 inline"></div>

            <Radio
              name="riskLevel"
              checked={isChecked("26,50")}
              label={
                <Typography
                  color="orange"
                  className="flex font-medium text-orange-300"
                >
                  Moderate
                  <Typography
                    as="a"
                    href="#"
                    color="blue-gray"
                    className="hover:text-blueg-gray-900 font-medium transition-colors"
                  >
                    : 26-50%
                  </Typography>
                </Typography>
              }
              value={[26, 50]}
              onChange={handleChange}
              ripple={false}
            />
            <div className="pl-12 inline"></div>

            <Radio
              name="riskLevel"
              checked={isChecked("51,75")}
              label={
                <Typography
                  color="deep-orange"
                  className="flex font-medium text-deep-orange-800"
                >
                  High
                  <Typography
                    as="a"
                    href="#"
                    color="blue-gray"
                    className="hover:text-blueg-gray-900 font-medium transition-colors"
                  >
                    : 51-75%
                  </Typography>
                </Typography>
              }
              value={[51, 75]}
              onChange={handleChange}
              ripple={false}
            />
            <div className="pl-12 inline"></div>

            <Radio
              name="riskLevel"
              checked={isChecked("76,100")}
              label={
                <Typography
                  color="red"
                  className="flex font-medium text-red-900"
                >
                  Extreme
                  <Typography
                    as="a"
                    href="#"
                    color="blue-gray"
                    className="hover:text-blueg-gray-900 font-medium transition-colors"
                  >
                    : 76-100%
                  </Typography>
                </Typography>
              }
              value={[76, 100]}
              onChange={handleChange}
              ripple={false}
            />
          </div>
        </div>
        <div className="pt-10 pl-10">
          <label className="text-lg">
            3. Please kindly provide us with insights into your average lead
            time.
          </label>
          <InfoPopup infoText={information3} />
          <p className="text-s text-gray-500 pl-4 pt-1.5">
            Your lead time help us understanding the duration it typically takes
            for your processes, from initiation to completion, will enable us to
            better comprehend the efficiency of your operations and facilitate
            more effective collaboration.
          </p>
          <div className="w-72 pt-4 pl-4 inline-block">
            <Input
              type="number"
              label="Lead Time"
              // placeholder="Ex. 1000000"
              min={1}
              max={366}
              variant="outlined"
              name="leadTime"
              value={formData.leadTime}
              onChange={handleChange}
              className="inline-block float-left"
            />
          </div>
          <span className="inline-block pl-2.5">Day</span>
        </div>
      </div>
    </div>
  );
};

export default Asking;
