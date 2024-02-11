import React, { useEffect, useState } from "react";

const AboutUs = () => {
  return (
    <div className="pt-24 grid grid-cols-3 gap-4 content-center">
      <div className="mt-10 text-center px-4 sm:px-8 col-span-3">
        <h1 className="text-4xl sm:text-5xl font-bold">About Smart Stock</h1>
        <div className="text-lg sm:text-xl mt-6">
          <p>
            This website was created as a tool to help businesses analyze data,{" "}
            <br />
            predict trends in ordering decision-making to be efficient.
            <br />
            It will also reduce the cost of stock management and promote
            readiness
            <br />
            to deal with changing economic situations effectively.
          </p>
        </div>
      </div>

      <div className="mt-10 text-center px-4 sm:px-8 col-span-3">
        <h2 className="text-3xl font-semibold">Our Mission</h2>
        <p className="text-lg mt-4">
          Our mission is to equip users with the ability
          <br />
          to make informed decisions about product orders, fostering efficiency
          <br />
          and adaptability in the face of changing market conditions.
        </p>
      </div>

      <div className="mt-10 pb-16 text-center px-4 sm:px-8 col-span-3">
        <h2 className="text-3xl font-semibold">Meet Our Team</h2>

        <div className="mt-10 text-center px-4 sm:px-8 col-span-3">
          <img
            src={process.env.PUBLIC_URL + "/assets/3M.svg"}
            className="w-6/12"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
