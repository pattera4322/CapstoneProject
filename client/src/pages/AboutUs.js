import React, { useEffect, useState } from "react";
import LoadingPage from "../components/LoadingPage";

const AboutUs = () => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);
  return (
    <div className="pt-28 grid grid-cols-2 gap-4 content-center">
      <LoadingPage loading={isLoading} />
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
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
            Our Team
          </h1>
          <div className="text-base sm:text-lg mt-6 text-left">
            <p>1.Kittiphum Uamthon 63130500006</p>
            <p>2.Suwaphit Chotsawad 63130500126</p>
            <p>3.Pattera Jongwtananugul 63130500143</p>
          </div>
        </div>
      </div>

      <div className="pt-4 grid grid-cols-2 col-span-1 transition-transform duration-1000">
        <div className="flex-col justify-between items-end">
          <div className="relative">
            <img
              src={process.env.PUBLIC_URL + "/assets/Max.svg"}
              alt="SmartStock Log in"
              className="lg:w-64 3xl:w-80 mb-16"
            />
            {/* <div className="absolute flex items-center justify-center mb-16 bottom-0 left-0 right-0 top-0 overflow-hidden bg-black bg-opacity-50 bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100">
              <div className="text-2xl font-bold text-white">
                Kittiphum Uamthon
              </div>
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
