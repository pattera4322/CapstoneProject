import { useEffect, useState } from "react";
import { enqueueData, analyzeData } from "../../api/analyzeApi";
import { postUserInsight } from "../../api/userInsightApi.js";
import { useNavigate } from "react-router-dom";
import Popup from "../Popup";

const Analyzing = ({ fileId }) => {
  const navigate = useNavigate();
  const [askingItem, setAskingItem] = useState(
    JSON.parse(localStorage.getItem("askingItems")) || {}
  );
  const [fileName, setFileName] = useState(
    JSON.parse(localStorage.getItem("fileName")) || {}
  );
  const [error, setError] = useState(null);

  const [insightData, setInsightData] = useState({
    salesGoal: askingItem.salesGoal || 0,
    riskLevel: askingItem.riskLevel || [0, 25],
    leadTime: askingItem.leadTime || 1,
    // fileName: fileName || {},
    costPerProductStorage: askingItem.costPerProductStorage || 0,
    costPerOrder: askingItem.costPerOrder || 0,
  });

  useEffect(() => {
    postUserInsight(insightData, fileId).then(async () => {
      await analyzeData(fileId).then(() => {
        navigate("/History", { replace: true, state: fileId });
      });
    });
  }, []);

  return (
    <div className="pt-20">
      <div className="">
        <img
          className="motion-safe:animate-bounce"
          src={process.env.PUBLIC_URL + "/assets/Closebox.svg"}
          alt="open box"
          width={250}
        />
        <br />
        {/* <img src="/assets/Shadow.svg" alt="open box" width={250} /> */}
        {/* <div className="pt-24 bg-no-repeat bg-bottom bg-auto" style={{ backgroundImage: 'url("/assets/Shadow.svg")' }}></div> */}
      </div>

      {error && (
        <Popup
          onClose={() => setError(null)}
          header={"ERROR"}
          info={error.response.data.RespMessage}
          onContinue={() => {}}
          continueText={"Go to Reselect"}
        />
      )}
    </div>
  );
};

export default Analyzing;
