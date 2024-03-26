import { useEffect, useState, useContext } from "react";
import { analyzeData } from "../../api/analyzeApi";
import { postUserInsight } from "../../api/userInsightApi.js";
import { useNavigate } from "react-router-dom";
import Popup from "../Popup";
import Button3D from "../Button/Button3D.js";
import { socketJobProgress } from "../../config/socketClient.js";
import { ImageUrlsContext } from "../../context/ImageUrlsContext.js";
import AnalyzeLimitSection from "../AnalyzeLimitSection.js";
import { updateUserData } from "../../api/userDataApi.js";
import { showErrorAlert } from "../../utils/SwalAlert.js";

const AnalyzeSection = ({ fileId }) => {
  const imageUrls = useContext(ImageUrlsContext);
  const navigate = useNavigate();
  const [askingItem, setAskingItem] = useState(
    JSON.parse(localStorage.getItem("askingItems")) || {}
  );
  const fileName = JSON.parse(localStorage.getItem("fileName")) || {};

  const [error, setError] = useState(null);
  const [historyId, setHistoryId] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [errorLimitReach, setErrorLimitReach] = useState(null);
  const limit = localStorage.getItem("analyzeLimit");

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
  console.log(fileId);

  useEffect(() => {
    var limit = localStorage.getItem("analyzeLimit");
    if (limit < 5) {
      setIsLoading(true);
      updateUserData({ analyzeLimit: ++limit })
        .then((res) => {
          console.log(res);
          if (res.ResponseCode === 200) {
            //localStorage.setItem("analyzeLimit", JSON.stringify(limit));
            setIsLoading(true);
            analyzeData()
              .then(async (res) => {
                setIsLoading(false);
                setHistoryId(res.data.historyid);
                postUserInsight(insightData, res.data.historyid).then(
                  async () => {
                    socketJobProgress.connect();
                  }
                );
              })
              .catch((error) => {
                setIsLoading(false);
                if (error.response && error.response.status === 402) {
                  setErrorLimitReach(error.response.data.ResponseMessage);
                }
                console.log(error);
              });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.response) {
            showErrorAlert("Something went wrong!", `${error.response}`);
          }
        });
    }
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
          {errorLimitReach || limit >= 5 ? (
            <AnalyzeLimitSection />
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
                  src={imageUrls["manWithTrophy.gif"]}
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
