import React, { useEffect, useState } from "react";

const AboutUs = () => {
  return (
    <div className="pt-32 grid grid-cols-2 gap-4 content-center">
      <div className="flex flex-col items-center px-6 py-8 lg:py-0 text-left col-span-1">
        <div className="p-2 md:space-y-6 sm:p-8 w-full">
          <h1 className="text-6xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl dark:text-white">
            About Smart St<span style={{ color: '#0068D2' }}>o</span>ck
          </h1>
          <div className="text-base sm:text-lg mt-6 text-left">
            <p>This website was created as a tool to help businesses
              analyze data, predict trends in ordering decision-making 
              to be efficient. It will also reduce the cost of stock
              management and promote readiness to deal with changing
              economic situations effectively.</p>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
            Our Mission
          </h1>
          <div className="text-base sm:text-lg mt-6 text-left">
            <p>Our mission is to equip users with the ability to
              make informed decisions about product orders,
              fostering efficiency and adaptability in the face of
              changing market conditions. <br /></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 col-span-1 transition-transform duration-1000">
        <div className="flex-col justify-between items-end">
          <div className="relative">
            <img
              src={process.env.PUBLIC_URL + "/assets/Max.svg"}
              alt="SmartStock Log in"
              className="lg:w-64 3xl:w-80 mb-16"
            />
            {/* <div className="absolute left-0 lg:w-30 3xl:w-80 h-64 inset-x-0 bottom-0 bg-gray-800 bg-opacity-75 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              Hover Text
            </div> */}
          </div>
          <img
            src={process.env.PUBLIC_URL + "/assets/Mint.svg"}
            alt="SmartStock Log in"
            className="lg:w-64 3xl:w-80"
          />
        </div>
        <img
          src={process.env.PUBLIC_URL + "/assets/My.svg"}
          alt="SmartStock Log in"
          className="lg:w-64 3xl:w-80 self-center"
        />
      </div>
    </div>
  );
};

export default AboutUs;
