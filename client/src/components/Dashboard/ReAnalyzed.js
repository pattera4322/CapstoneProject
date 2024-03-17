import React, { useEffect, useState } from "react";
import { Button, Input} from "@material-tailwind/react";
import { updateUserInsight } from "../../api/userInsightApi.js";

const ReAnalyzed = ({ handleClose, userData, fileId}) => {
  const [formData, setFormData] = useState({
    days: 90,
    salesGoal: 1,
    riskLevel: [0, 0],
    leadTime: 1,
    costPerProductStorage: 1,
    costPerOrder: 1,
  });
  
  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, []);

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
    else if (name === "leadTime") {
      leadTimeValidation(e);
    } else {
      moneyValidation(name,e)
  }};

  const moneyValidation = (name,event) => {
    let inputValue = event.target.value;
    const moneyRegex = /^(?!-)\d+(\.\d{0,2})?$/; // /^\d+(\.\d{1,2})?$/;

    const isValidInput = moneyRegex.test(inputValue);
    if (isValidInput) {
      if (inputValue > 0 && inputValue <= 1000000000){
        inputValue = inputValue;
        setFormData({ ...formData, [name]: inputValue });
      } else if (inputValue <= 0) {
        inputValue = 1;
        setFormData({ ...formData, [name]: inputValue });
      } else if (inputValue > 1000000000) {
        inputValue = inputValue.slice(0, 10);
        setFormData({ ...formData, [name]: inputValue });
      }
    } else {
      inputValue = inputValue.includes("-")? inputValue.replace("-", "").slice(0, 10) : parseFloat(inputValue).toFixed(2)
      setFormData({ ...formData, [name]: inputValue });
    }
  };

  //handle if user type more than 366 days
  const leadTimeValidation = (e) => {
    let newValue = parseInt(e.target.value, 10);

    if (!isNaN(newValue)) {
      if (newValue >= 1 && newValue <= 366) {
        setFormData({ ...formData, leadTime: newValue });
      } else if (newValue > 366) {
        newValue = 366;
        setFormData({ ...formData, leadTime: newValue });
      } else {
        newValue = 1;
        setFormData({ ...formData, leadTime: newValue });
      }
    } else {
      newValue = "";
      setFormData({ ...formData, leadTime: newValue });
    }
  };

  const handleSubmit = () => {
    if (localStorage.getItem("user")) {
      localStorage.setItem("askingItems", JSON.stringify(formData))
    }
    updateUserInsight(formData, fileId).then(handleClose)
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
      <div className="z-50 bg-white p-8 rounded-md shadow-lg flex flex-col w-auto">
        <div className="mb-4 text-s text-left">
          {/* SalesGoal */}
          <div>
            <label className="text-lg font-bold">Sales goal</label>
          </div> 
          <div className="w-64 pt-2 inline-block">
              <Input
                type="number"
                label="Sales Goal"
                // placeholder="Ex. 1000000"
                min={1}
                max={1000000000}
                variant="outlined"
                name="salesGoal"
                value={formData.salesGoal}
                onChange={handleChange}
                className="inline-block float-left"
              />
            </div>
            <span className="inline-block pl-2.5">Baht</span>

          {/* Cost of storage per unit per year */}
          <div className="pt-3">
            <label className="text-lg font-bold">Cost of storage per unit per year</label>
          </div> 
          <div className="w-64 pt-2 inline-block">
              <Input
                type="number"
                label="costPerProductStorage"
                // placeholder="Ex. 1000000"
                min={1}
                max={1000000000}
                variant="outlined"
                name="costPerProductStorage"
                value={formData.costPerProductStorage}
                onChange={handleChange}
                className="inline-block float-left"
              />
            </div>
            <span className="inline-block pl-2.5">Baht</span>

          {/* Cost Per Order */}
          <div className="pt-3">
            <label className="text-lg font-bold">Cost per order</label>
          </div> 
          <div className="w-64 pt-2 inline-block">
              <Input
                type="number"
                label="costPerOrder"
                // placeholder="Ex. 1000000"
                min={1}
                max={1000000000}
                variant="outlined"
                name="costPerOrder"
                value={formData.costPerOrder}
                onChange={handleChange}
                className="inline-block float-left"
              />
            </div>
            <span className="inline-block pl-2.5">Baht</span>

          {/* Lead time */}
          <div className="pt-3">
            <label className="text-lg font-bold">Lead time</label>
          </div> 
          <div className="w-64 pt-2 inline-block">
              <Input
                type="number"
                label="leadTime"
                // placeholder="Ex. 1000000"
                min={1}
                max={365}
                variant="outlined"
                name="leadTime"
                value={formData.leadTime}
                onChange={handleChange}
                className="inline-block float-left"
              />
            </div>
            <span className="inline-block pl-2.5">Day</span>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            id="close-modal"
            type="button"
            className="mr-2 bg-gray-300 text-black"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-[#0068D2]">
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ReAnalyzed;
