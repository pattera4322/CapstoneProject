import React, { useState } from "react";
import { Input, Radio, Typography } from "@material-tailwind/react";
import ButtonComponent from "../Button";


const DownloadTemplate = () => {
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  return (
    <div className="pt-10">
      {/* <div className="pb-8 text-xl font-bold text-black">
        Please download our template and enter your data as required to align the columns for analysis.
      </div>
      <img
        src={process.env.PUBLIC_URL + "/assets/template.svg"}
        style={{ transform: isZoomed ? "scale(1.5)" : "scale(1)" }}
        className="shadow-md cursor-pointer h-54 ml-2"
        alt="resetIcon"
        onClick={toggleZoom}
      />

      <br />
      <br />
      <div className="flex justify-center mx-16 mt-8">
        <a href={process.env.PUBLIC_URL + "/assets/template.xlsx"} download>
          <ButtonComponent
            onClick={() => { }}
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
      </div>
      <br /> */}

      {/* <div className="px-4 md:px-10 lg:px-64 py-4 text-left">
        <h1 className="text-2xl text-[#0068D2]">
          <b>Instructions</b>
        </h1>
        <div className="pt-1.5 text-lg">
          <label className="text-lg">
            <b>Data Input Requirements</b>
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
          </div>
        </div>
      </div> */}

      <div className="text-xl font-bold text-black">
        Please download our template and enter your data as required to align the columns for analysis.
      </div>

      <div className="pt-12 grid grid-cols-2 gap-4 content-center">
        <div className={`grid grid-cols-subgrid col-span-1 transition-transform translate-x-0 duration-1000`}>
          <img
            src={process.env.PUBLIC_URL + "/assets/SmartStockTemplate.svg"}
            alt="SmartStock Log in"
            className="mx-auto w-72 max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
          />
        </div>
        <div>
          <img
            src={process.env.PUBLIC_URL + "/assets/template.svg"}
            // style={{ transform: isZoomed ? "scale(1.5)" : "scale(1)" }}
            className="shadow-md w-full"
            alt="resetIcon"
            // onClick={toggleZoom}
          />

          <br />
          <br />

          <a href={process.env.PUBLIC_URL + "/assets/template.xlsx"} download>
            <ButtonComponent
              onClick={() => { }}
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
        </div>
      </div>
    </div>
  );
};

export default DownloadTemplate;
