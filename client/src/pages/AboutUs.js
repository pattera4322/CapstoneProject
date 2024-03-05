import React, { useEffect, useState } from "react";

const AboutUs = () => {
  return (
    // <div className="pt-24 grid grid-cols-3 gap-4 content-center">
    //   <div className="mt-10 text-center px-4 sm:px-8 col-span-3">
    //     <h1 className="text-4xl sm:text-5xl font-bold">About Smart Stock</h1>
    //     <div className="text-lg sm:text-xl mt-6">
    //       <p>
    //         This website was created as a tool to help businesses analyze data,{" "}
    //         <br />
    //         predict trends in ordering decision-making to be efficient.
    //         <br />
    //         It will also reduce the cost of stock management and promote
    //         readiness
    //         <br />
    //         to deal with changing economic situations effectively.
    //       </p>
    //     </div>
    //   </div>

    //   <div className="mt-10 text-center px-4 sm:px-8 col-span-3">
    //     <h2 className="text-3xl font-semibold">Our Mission</h2>
    //     <p className="text-lg mt-4">
    //       Our mission is to equip users with the ability
    //       <br />
    //       to make informed decisions about product orders, fostering efficiency
    //       <br />
    //       and adaptability in the face of changing market conditions.
    //     </p>
    //   </div>

    //   <div className="mt-10 pb-16 text-center px-4 sm:px-8 col-span-3">
    //     <h2 className="text-3xl font-semibold">Meet Our Team</h2>

    //     <div className="mt-10 text-center px-4 sm:px-8 col-span-3">
    //       <img
    //         src={process.env.PUBLIC_URL + "/assets/3M.svg"}
    //         className="w-6/12"
    //       />
    //     </div>
    //   </div>
    // </div>

    <div className="pt-32 grid grid-cols-2 gap-4 content-center">
      <div className="flex flex-col items-center px-6 py-8 lg:py-0 text-left col-span-1">
        <div className="p-2 md:space-y-6 sm:p-8 w-full">
          <h1 className="text-6xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl dark:text-white">
            About Smart St<span style={{ color: '#0068D2' }}>o</span>ck
          </h1>
          <div className="text-base sm:text-lg mt-6 text-left">
            <p>This website was created as a tool to help businesses <br />
              analyze data, predict trends in ordering decision-making <br />
              to be efficient. It will also reduce the cost of stock <br />
              management and promote readiness to deal with changing <br />
              economic situations effectively.</p>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
            Our Mission
          </h1>
          <div className="text-base sm:text-lg mt-6 text-left">
            <p>Our mission is to equip users with the ability to <br />
              make informed decisions about product orders, <br />
              fostering efficiency and adaptability in the face of <br />
              changing market conditions. <br /></p>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-subgrid col-span-1 transition-transform translate-x-0 duration-1000`}>
        <img
          src={process.env.PUBLIC_URL + "/assets/SmartStockLogIn.svg"}
          alt="SmartStock Log in"
          className="mx-auto w-7/12 max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
        />
      </div>
    </div>
  );
};

export default AboutUs;
