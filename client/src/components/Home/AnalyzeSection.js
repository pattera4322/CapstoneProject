import { useEffect, useState } from "react";
import { analyzeData } from "../../api/analyzeApi";
import { postUserInsight } from "../../api/userInsightApi.js";
import { useNavigate } from "react-router-dom";
import Popup from "../Popup";
import Button3D from "../Button/Button3D.js";

const Analyzing = ({ fileId }) => {
  const navigate = useNavigate();
  const [askingItem, setAskingItem] = useState(
    JSON.parse(localStorage.getItem("askingItems")) || {}
  );
  const [error, setError] = useState(null);
  const [loading, setIsLoading] = useState(false);

  const [insightData, setInsightData] = useState({
    salesGoal: askingItem.salesGoal || 0,
    riskLevel: askingItem.riskLevel || [0, 25],
    leadTime: askingItem.leadTime || 1,
    costPerProductStorage: askingItem.costPerProductStorage || 0,
    costPerOrder: askingItem.costPerOrder || 0,
  });

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    setIsLoading(true);
    postUserInsight(insightData, fileId).then(async () => {
      await analyzeData(fileId).then(async () => {
        setIsLoading(false);
        // await delay(3000);
        //navigate("/History", { replace: true, state: fileId });
      });
    });
  }, []);

  return (
    <div className="pt-10">
      {loading ? (
        <div>
          <img
            className="motion-safe:animate-bounce"
            src={process.env.PUBLIC_URL + "/assets/Closebox.svg"}
            alt="open box"
            width={250}
          />
        </div>
      ) : (
        <div>
          <div>
            <p className="text-3xl font-medium ">
              You have successfully sent the data for analysis.
            </p>
            <p className="text-xl pt-2 ">
              You can go to the status page where you can track the progress of
              your analysis. This page will display the job currently in the
              queue.
            </p>
            <div className="pt-5">
              <Button3D
                onClick={() => {
                  navigate("/History", { replace: true, state: fileId });
                }}
                children={<span>Go to status page</span>}
              />
            </div>
          </div>
          <div className="">
            <img
              className=""
              src={process.env.PUBLIC_URL + "/assets/manWithTrophy.gif"}
              alt="manWithTrophy"
              width={1500}
            />
          </div>
        </div>
      )}
      {/* {error && (
        <Popup
          onClose={() => setError(null)}
          header={"ERROR"}
          info={error.response.data.ResponseMessage}
          onContinue={() => {}}
          continueText={"Go to Reselect"}
        />
      )} */}
    </div>
  );
};

export default Analyzing;
