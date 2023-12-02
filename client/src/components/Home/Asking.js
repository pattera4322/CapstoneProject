import React, { useState, useEffect } from "react";
import { Input, Radio, Typography } from "@material-tailwind/react";

const Asking = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    salesGoal: 0,
    riskLevel: [0, 0],
  });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("items"));
    if (items) {
      setFormData(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(formData));
  }, [formData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(name, value)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    console.log("Form submitted with:", formData);
  };

  return (
    <div class="text-black">
      <h2 className="text-xl pt-10">
        At <b>Smart Stock</b>, we aim to provide you with personalized insights
        and recommendations. To better tailor our services to your needs, please
        provide the following information.
      </h2>
      <div onSubmit={handleSubmit} className="pt-10 text-left">
  
        <div className="pt-10 pl-10">
          <label className="text-lg">
            1. Please share your current sales goal with us.
          </label>
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
          </label>
          <p className="text-s text-gray-500 pl-4 pt-1.5">
            Knowing your risk tolerance enables us to provide stock predictions
            that match your investment preferences, ensuring a more tailored and
            suitable experience for you.
          </p>
          <div className="gap-10 pt-3.5">
            <Radio
              name="riskLevel"
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
              value={formData.riskLevel}
              onChange={handleChange}
              ripple={true}
            />
            <div className="pl-12 inline"></div>

            <Radio
              name="riskLevel"
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
              value={formData.riskLevel}
              onChange={handleChange}
              ripple={false}
            />
            <div className="pl-12 inline"></div>

            <Radio
              name="riskLevel"
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
              value={formData.riskLevel}
              onChange={handleChange}
              ripple={false}
            />
            <div className="pl-12 inline"></div>

            <Radio
              name="riskLevel"
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
              value={formData.riskLevel}
              onChange={handleChange}
              ripple={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asking;

