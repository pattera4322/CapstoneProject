import { useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import Button3D from "./Button/Button3D.js";
import { ImageUrlsContext } from "../context/ImageUrlsContext.js";

const AnalyzeLimitSection = () => {
  const imageUrls = useContext(ImageUrlsContext);
  const navigate = useNavigate();

  const [loading, setIsLoading] = useState(false);
  const [errorLimitReach, setErrorLimitReach] = useState(null);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  return (
      <div className="flex justify-center items-center">
        <img
          src={imageUrls["limitReachMan.png"]}
          alt="limitReachMan"
          width={200}
        />

        <div>
          <p className="text-3xl font-medium ">{errorLimitReach}</p>
          <p className="text-xl pt-2 ">
            You reaches a limit to analyze data. Try again tomorrow.
          </p>
          <div className="pt-5">
            <Button3D
              onClick={() => {}}
              children={<span>UPGRADE TO PREMIUM</span>}
            />
          </div>
        </div>
      </div>
  );
};

export default AnalyzeLimitSection;
