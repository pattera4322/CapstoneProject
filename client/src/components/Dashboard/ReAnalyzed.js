import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";

const reAnalyzed = ({ onClose }) => {
    const onSubmit = () =>{

    }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
      <div className="z-50 bg-white p-8 rounded-md shadow-lg flex flex-col w-96">
        <div className="mb-4 text-s text-gray-500 text-left">
          <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            ReAnalyzed naaaa
          </h3>
          <label className="text-lg font-bold">Sales goal</label>
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
          <Button onClick={onSubmit} className="bg-[#0068D2]">
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};
export default reAnalyzed;
