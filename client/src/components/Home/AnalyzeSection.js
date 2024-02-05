import { useEffect, useState } from "react";
import { enqueueData } from "../../api/analyzeApi";
import { postUserData } from "../../api/userDataApi";
import { useDataContext } from "../../context/AnalyzeDataContext";
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
  const { contextAnalyzeData, setContextAnalyzeData } = useDataContext();
  const [error, setError] = useState(null);

  const [userData, setUserData] = useState({
     "salesGoal": askingItem.salesGoal || 0,
     "riskLevel": askingItem.riskLevel || [0, 25],
     "leadTime": askingItem.leadTime || 1,
     "fileName": fileName || {}
  }
  );

  // const [formData, setFormData] = useState([
  //   askingItem.days || 90,
  //   askingItem.salesGoal || 0,
  //   askingItem.riskLevel || [0, 25],
  //   askingItem.leadTime || 1,
  //   fileName,
  //   {
  //     date: headerItems.date,
  //     // year: headerItems.year || "empty",
  //     // month: headerItems.month || "empty",
  //     productName: headerItems.prodName || "empty",
  //     totalSales: headerItems.sales || "empty",
  //     pricePerUnit: headerItems.price || "empty",
  //     quantity: headerItems.quantity || "empty",
  //   },
  //   "empty",
  //   [],
  //   userId,
  // ]);

  useEffect(() => {
    postUserData(userData).then(async (res) => {
      await enqueueData(fileId,userData).then((res) => {
        console.log(res)
      })
      // await delay(2000);
      navigate("/History");
    })
    // analyzeData(formData)
    //   .then((res) => {
    //     setContextAnalyzeData(res);
    //     console.log(contextAnalyzeData);
    //     navigate("/History");
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //     setError(error);
    //   });
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
