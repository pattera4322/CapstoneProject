import { useEffect, useState } from "react";
import { analyzeData } from "../../api/analyzeApi";
import { postUserInsight } from "../../api/userInsightApi.js";
import { useNavigate } from "react-router-dom";
import Popup from "../Popup";
import Button3D from "../Button/Button3D.js";
import { socketJobProgress } from "../../config/socketClient.js";

const AnalyzeSection = ({ fileId }) => {
  const navigate = useNavigate();
  const [askingItem, setAskingItem] = useState(
    JSON.parse(localStorage.getItem("askingItems")) || {}
  );
  const fileName = JSON.parse(localStorage.getItem("fileName")) || {}

  const [error, setError] = useState(null);
  const [historyId, setHistoryId] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [errorLimitReach, setErrorLimitReach] = useState(null);

  const [insightData, setInsightData] = useState({
    fileName: fileName[fileId],
    salesGoal: askingItem.salesGoal || 0,
    riskLevel: askingItem.riskLevel || [0, 25],
    leadTime: askingItem.leadTime || 1,
    costPerProductStorage: askingItem.costPerProductStorage || 0,
    costPerOrder: askingItem.costPerOrder || 0,
  });

  // function delay(ms) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }
  console.log(fileId)

  useEffect(() => {
    setIsLoading(true);
    analyzeData()
      .then(async (res) => {
        setIsLoading(false);
        setHistoryId(res.data.historyid);
        postUserInsight(insightData, res.data.historyid).then(async () => {
          socketJobProgress.connect();
        });
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response && error.response.status === 402) {
          setErrorLimitReach(error.response.data.ResponseMessage);
        }
        console.log(error);
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
          {errorLimitReach ? (
            <div className="flex justify-center items-center">
              <img
                src={process.env.PUBLIC_URL + "/assets/limitReachMan.png"}
                alt="manWithTrophy"
                width={200}
              />

              <div>
                <p className="text-3xl font-medium ">{errorLimitReach}</p>
                <p className="text-xl pt-2 ">
                  You reaches a limit to analyze data. Try again later.
                </p>
                <div className="pt-5">
                  <Button3D
                    onClick={() => {}}
                    children={<span>UPGRADE TO PREMIUM</span>}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <p className="text-3xl font-medium ">
                  You have successfully sent the data for analysis.
                </p>
                <p className="text-xl pt-2 ">
                  You can go to the status page where you can track the progress
                  of your analysis. This page will display the job currently in
                  the queue.
                </p>
                <div className="pt-5">
                  <Button3D
                    onClick={() => {
                      navigate("/History", { replace: true, state: historyId });
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
                  width={900}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* {error && (
        <Popup
          onContinue={() => setError(null)}
          header={error}
          info={"You reaches a limit to analyze data. Try again later."}
          continueText={"Confirm"}
        />
      )} */}
    </div>
  );
};

export default AnalyzeSection;
