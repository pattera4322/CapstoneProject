import React, { useContext } from "react";
import ButtonComponent from "../Button/Button";
import { ImageUrlsContext } from "../../context/ImageUrlsContext";


const DownloadTemplate = () => {
  const imageUrls = useContext(ImageUrlsContext);
  return (
    <div className="pt-10">
      <div className="text-xl font-bold text-black">
        Please download our template and enter your data as required to align the columns for analysis.
      </div>

      <div className="pt-12 grid grid-cols-2 gap-4 content-center">
        <div className={`grid grid-cols-subgrid col-span-1 transition-transform translate-x-0 duration-1000`}>
          <img
            src={imageUrls["SmartStockTemplate.svg"]}
            alt="Smart Stock Template"
            className="mx-auto w-64 max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
          />
        </div>
        <div>
          <img
            src={imageUrls["template.svg"]}
            className="shadow-md w-full"
            alt="resetIcon"
          />

          <br />
          <br />

          <div>
            <ButtonComponent
              onClick={() => {
                window.location.href = imageUrls["template.xlsx"]
              }}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadTemplate;
