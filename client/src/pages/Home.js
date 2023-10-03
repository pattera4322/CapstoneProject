import React, { useEffect, useState, useRef } from "react";
import FileUploader from "../components/FileUploader";
import "../index.css";
// import "./Home.css";

function HomePage() {
  const importSection = useRef(null);
  const scrolldown = () => {
    importSection.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const [fileName, setFileName] = useState("");
  const handleFile = (file) => {
    setFileName(file.name);
  };



  return (
    <div>
      <div>
        <h1 className="text-6xl font-bold mt-14">
          Step into a Smarter Retail Experience!
        </h1>
        <div className="text-2xl mt-10">
          <p>Maximize the potential of your workforce by automating</p>
          <p>complexing tasks and optimizing workflows with our</p>
          <p>predictive stocking data.</p>
        </div>
        <div>
          <button
            onClick={scrolldown}
            class="text-3xl mt-20 hover:bg-orange-100 text-black border-2 border-black rounded-full px-10 py-4"
          >
            Let’s get start!
          </button>
        </div>
        <img src="assets/Openedbox.svg" className="mt-16 object-cover w-full" />
      </div>

      <div class="importSection" ref={importSection}>
        <div>
          <FileUploader handleFile={handleFile} />
          {fileName ? <p required onChange={handleFile}>Uploaded file: {fileName}</p> : null}
          {/* <div className="text-2xl mt-3">
            <p>Support .xlsx and .csv</p>
          </div> */}


          {/* <label htmlFor="file" className="">
            Import Dataset
            </label> */}
          {/* <input id="file" type="file" onChange={handleFileChange} /> */}
        </div>
        {/* {file && (
            <section>
            File details:
            <ul>
                <li>Name: {file.name}</li>
                <li>Type: {file.type}</li>
                <li>Size: {file.size} bytes</li>
            </ul>
            </section>
        )} */}

        {/* {file && <button onClick={handleUpload}>Upload a file</button>} */}

        <div>
          <div className="text-2xl mt-64">
            <p>Instructions</p>
          </div>
          <ul>
            <li>1. Allow only one file to be uploaded at a time.</li>
            <li>2. The uploaded file must be in either .csv or .xlsx format.</li>
            <li>3. If the uploaded file is in .csv format, it should contain specific required columns such as "Product ID," "Quantity," "Price," "Date," etc., for inventory and retail forecasting.</li>
            <li>4. Validate the data in the uploaded file to ensure it meets specific criteria. For example, ensure that quantity values are numeric, date values are in a valid format, and prices are positive numbers.</li>
            <li>5. Check for and handle duplicate data entries within the uploaded file.</li>
            <li>6. Implement a file naming convention that users should follow when uploading file as Yourname_forecasted_data.csv or Yourname_forecasted_data.xlsx</li>
            <li>ETC. If any ahhhhhhhhhhhhhhhhhh</li>
          </ul>   
        </div>
      </div>
    </div>
  );
}

export default HomePage;
