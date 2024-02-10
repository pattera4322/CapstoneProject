import React, { useEffect, useState } from "react";

const TeamCard = ({ imgSrc, name, email }) => (
    <div className="rounded-lg p-6 shadow-md">
      <img
        src={imgSrc}
        alt={name}
        className="w-64 rounded-lg mx-auto mb-4"
      />
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-600">{email}</p>
    </div>
  );

const AboutUs = () => {
    return (
        <div className="pt-24 grid grid-cols-3 gap-4 content-center">
            <div className="mt-10 text-center px-4 sm:px-8 col-span-3">
                <h1 className="text-4xl sm:text-5xl font-bold">
                    About Smart Stock
                </h1>
                <div className="text-lg sm:text-xl mt-6">
                    <p>
                        This website was created as a tool to help businesses analyze data, <br />
                        predict trends in ordering decision-making to be efficient.<br />
                        It will also reduce the cost of stock management and promote readiness<br />
                        to deal with changing economic situations effectively.
                    </p>
                </div>
            </div>

            <div className="mt-10 text-center px-4 sm:px-8 col-span-3">
                <h2 className="text-3xl font-semibold">Our Mission</h2>
                <p className="text-lg mt-4">
                    Our mission is to equip users with the ability<br />
                    to make informed decisions about product orders, fostering efficiency<br />
                    and adaptability in the face of changing market conditions.
                </p>
            </div>

            <div className="mt-10 pb-16 text-center px-4 sm:px-8 col-span-3">
                <h2 className="text-3xl font-semibold">Meet Our Team</h2>

                <div className="mt-10 text-center px-4 sm:px-8 col-span-3">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                        <TeamCard
                            imgSrc={process.env.PUBLIC_URL + "/assets/Max.jpg"}
                            name="Max"
                            email="Kittiphum Uamthon"
                        />

                        <TeamCard
                            imgSrc={process.env.PUBLIC_URL + "/assets/My.jpg"}
                            name="My"
                            email="Suwaphit Chotsawad"
                        />

                        <TeamCard
                            imgSrc={process.env.PUBLIC_URL + "/assets/Mint.jpg"}
                            name="Mint"
                            email="Pattera Jongwtananugul"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs;