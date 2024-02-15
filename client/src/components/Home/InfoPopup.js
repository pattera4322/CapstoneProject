import React, { useState } from 'react';

const InfoPopup = ({ infoText }) => {
    const [isPopupVisible, setPopupVisibility] = useState(false);

    const handleMouseEnter = () => {
        setPopupVisibility(true);
    };

    const handleMouseLeave = () => {
        setPopupVisibility(false);
    };

    return (
        <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <span className="text-blue-500 cursor-pointer">
                <img
                    src={process.env.PUBLIC_URL + "assets/info.svg"}
                    className="h-4 ml-2"
                    alt="resetIcon"
                />
            </span>
            {isPopupVisible && (
                <div className="absolute z-10 w-64 transform -translate-x-1/2 bg-white p-4 rounded-md shadow-md">
                    {infoText}
                </div>
            )}
        </div>
    );
};

export default InfoPopup;

