import React from "react";
import { Input, Radio, Typography } from "@material-tailwind/react";
import ButtonComponent from "../Button";


const DownloadTemplate = () => {
  return (
    <div className="pt-10">
      <div className="pb-8 text-gray-500">
        Download our template, enter your info to align columns for analysis.
      </div>
      <img
        src={process.env.PUBLIC_URL + "/assets/template.svg"}
        className="h-54 ml-2 shadow-md"
        alt="resetIcon"
      />

      <br />
      <br />
      <a href={process.env.PUBLIC_URL + "/assets/template.xlsx"} download>
        <ButtonComponent
          onClick={() => {}}
          children={
            <div>
              <svg
                className="fill-current w-4 h-4 mr-2 inline"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              Template
            </div>
          }
        ></ButtonComponent>{" "}
      </a>
      <br />

      <div className="px-4 md:px-10 lg:px-64 py-4 text-left">
        <h1 className="text-2xl">
          <b>Instructions</b>
        </h1>
        <div className="pt-1.5 text-lg">
          <label className="text-lg">
            <b>1. Data Input Requirements</b>
          </label>
          <div className="text-s pl-4 pt-1.5">
            <p>
              To ensure accurate predictions and insightful analysis, we require
              the following data:
            </p>
            <ul className="list-disc pl-4">
              <li>
                <b>Date</b>: Input the date of the sales transaction. Use the
                specified date format (e.g., YYYY-MM-DD).
              </li>
              <li>
                <b>Product Name/Product Category</b>: Specify the name or
                category of the product.
              </li>
              <li>
                <b>Price per Unit</b>: Enter the unit price of the product.
              </li>
              <li>
                <b>Quantity</b>: Specify the quantity of units sold.
              </li>
              <li>
                <b>Total Sales</b>: Provide the total sales amount for the
                transaction. If available, provide the total sales. Note that
                having price per unit and quantity is sufficient; total sales is
                optional.
              </li>
            </ul>
            <p className="text-lg pt-5">
              <b>Data Input Template</b>
            </p>
            <ol class="list-decimal pl-4">
              <li>
                Download Template: Click <u>here</u> or download template in
                step 2 to download the data input template.
              </li>
              <li>
                Fill in Data: Enter your data into the template, following the
                specified formats.
              </li>
              <li>Save Template: Save the completed template.</li>
            </ol>
            <p className="pt-5">
              Please note the following format requirements to align with the
              template to maintain data integrity and ensure accurate
              predictions:
            </p>
            <ul className="list-disc pl-4">
              <li>
                Date Format: Use the format YYYY-MM-DD (e.g., 2024-01-17).
              </li>
              <li>
                Product Name/Product Category Format: Ensure the name or
                category follows standard text conventions.
              </li>
              <li>
                Price per Unit, Quantity, and Total Sales: Ensure the type of
                value is a number.
              </li>
            </ul>
          </div>
          <div className="pt-5">
            <label className="text-lg">
              <b>2. Data Submission</b>
            </label>
            <div className="text-s pl-4 pt-1">
              <p>
                Once you have filled in the data in the template, follow these
                steps to submit it:
              </p>
              <ol className="list-decimal pl-4">
                <li>
                  Please click next step navigate you to step 3 for upload
                  filled template.
                </li>
                <li>
                  Upload Template: Find the option to upload data, and upload
                  the completed template.
                </li>
                <li>
                  Submit Data: Click the submit button to upload your data for
                  analysis.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadTemplate;
