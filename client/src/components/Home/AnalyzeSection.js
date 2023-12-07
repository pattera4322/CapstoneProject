import { useEffect, useState } from "react";
import { analyzeData } from "../../api/analyzeApi";
import { getFile } from "../../api/fileApi";

const Analyzing = ({ fileName }) => {
  const [askingItem, setAskingItem] = useState(
    JSON.parse(localStorage.getItem("askingItems")) || {}
  );
  const [headerItems, setHeaderItems] = useState(
    JSON.parse(localStorage.getItem("headerItems")) || {}
  );
  const [file, setFile] = useState([]);

  // TODO: When have authenticate change this
  const userId = "user1"

  const [formData, setFormData] = useState([
    askingItem.days || 90,
    askingItem.salesGoal || 0,
    askingItem.riskLevel || [0, 25],
    fileName,
    {
      date: headerItems.date,
      year: headerItems.year || "empty",
      month: headerItems.month || "empty",
      productName: headerItems.prodName || "empty",
      totalSales: headerItems.sales || "empty",
      cost: headerItems.price || "empty",
      quantity: headerItems.quantity || "empty",
    },
    "empty",
    [],
    userId
  ]);

  // function arrayBufferToBase64(buffer) {
  //   const binary = new Uint8Array(buffer);
  //   return btoa(String.fromCharCode.apply(null, binary));
  // }

  useEffect(() => {
    getFile("user1", fileName).then((data) => {
      if (data) {
        console.log(data)
        const updatedFormData = [...formData];

        // updatedFormData[6] = arrayBufferToBase64(data);
        updatedFormData[6] = data;
        console.log(updatedFormData);
   
        analyzeData(updatedFormData).then((res) => {
          console.log(res)
        });
      } else {
        setFile([]);
      }
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
    </div>
  );
};

export default Analyzing;
