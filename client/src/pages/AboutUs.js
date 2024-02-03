import React, { useEffect, useState } from "react";

const AboutUs = () => {
    return (
        <div className="pt-24 grid grid-cols-3 gap-4 content-center">
            {/* Section 1: Introduction */}
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

            {/* Section 2: Our Mission */}
            <div className="mt-10 text-center px-4 sm:px-8 col-span-3">
                <h2 className="text-3xl font-semibold">Our Mission</h2>
                <p className="text-lg mt-4">
                    Our mission is to equip users with the ability<br />
                    to make informed decisions about product orders, fostering efficiency<br />
                    and adaptability in the face of changing market conditions.
                </p>
            </div>

            {/* Section 3: Our Team */}
            <div className="mt-10 text-center px-4 sm:px-8 col-span-3">
                <h2 className="text-3xl font-semibold">Meet Our Team</h2>
                {/* Include details about your team members here */}
            </div>

            {/* Section 4: Contact Information */}
            <div className="mt-10 text-center px-4 sm:px-8 col-span-3">
                <h2 className="text-3xl font-semibold">Contact Us</h2>
                <p className="text-lg mt-4">
                    Have questions or want to learn more about our services? Reach out to
                    us at [Your Contact Email] or give us a call at [Your Contact Phone
                    Number].
                </p>
            </div>
        </div>
    )
}

export default AboutUs;