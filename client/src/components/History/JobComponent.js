import React, { useState } from "react";
import ProgressBar from "../ProgressBar";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../Button/Button";
import DeleteButton from "../Button/DeleteButton";
import { formatDateTimeStamp } from "../../utils/FormatDateTime";
import { getFile } from "../../api/fileApi";

const JobComponent = ({ job, progressData, index, insightData }) => {
  const navigate = useNavigate();
  const isJobFailed = job.state === "fail";
  const isJobCompleted = job.state === "success";
  const isJobProgress = job.state === "running";
  const isJobWaiting = job.state === "wait";
  const jobId = job.historyid;
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleDetails = () => {
    // Toggle showDetails state for this job
    setShowDetails(!showDetails);
  };

  const OnCompletedJobClick = () => {
    console.log(JSON.stringify(job));
    if (isJobCompleted) {
      navigate("/Dashboard", { replace: true, state: jobId });

      // getFile(`predicted_of_${jobId}.json`).then((res) => {
      //   let decoder = new TextDecoder("utf-8");
      //   let jsonString = decoder.decode(res);
      //   console.log(JSON.parse(jsonString));
      // });
    }
  };

  const handleCancelQueue = () => { };

  return (
    <div
      key={index}
      className={`transition ease-in-out hover:-translate-y-1 hover:scale-10 mx-16 my-8 px-8 py-8 rounded-md text-left shadow-[0px_10px_1px_rgba(221,221,221,1),0_10px_20px_rgba(204,204,204,1)]`}
    >
      {isJobWaiting && (
        <div className="">
          <DeleteButton onClick={handleCancelQueue} children={"Cancel"} />
        </div>
      )}

      {isJobProgress || isJobWaiting ? <div><span className="font-semibold">QUEUE NUMBER:</span> {index + 1}</div> : null}

      <div>
        <span className="font-semibold">FILE NUMBER:</span> {jobId}
      </div>
      <div style={{ wordWrap: "break-word" }}>
        <span className="font-semibold">FILE NAME:</span>{" "} {insightData[jobId - 1].fileName || "Not found file name"}
      </div>

      {isJobCompleted || isJobFailed ? (
        <div>
          <div className="inline">
            <span className="font-semibold">STATE:</span>{" "}
            <span
              className={
                isJobCompleted
                  ? "px-2 rounded-full bg-lime-100"
                  : "px-2 rounded-full bg-red-100"
              }
            >
              {job.state}
            </span>
            {job.errorMessage && (
              <div className="inline">
                <span> with </span>
                {job.errorMessage}
              </div>
            )}
          </div><br />

          {/* {job.errorMessage && <div><span className="font-semibold">ERROR WITH:</span>{" "}{job.errorMessage}</div>} */}
          <span className="font-semibold">ANALYZED ON:</span>{" "}
          <span className="px-2 rounded-full bg-cyan-100">
            {formatDateTimeStamp(job.analyzedTime)}
          </span>
        </div>
      ) : null}
      {showDetails && (
        <div>
          <div><span className="font-semibold">Sales Goal:</span> {insightData[jobId - 1].salesGoal}</div>
          <div><span className="font-semibold">Cost of storage per unit per year:</span>
            {" "}
            {insightData[jobId - 1].costPerProductStorage}
          </div>
          <div><span className="font-semibold">Cost per order:</span> {insightData[jobId - 1].costPerOrder}</div>
          <div><span className="font-semibold">Lead time:</span> {insightData[jobId - 1].leadTime}</div>
        </div>
      )}

      <button
        onClick={handleToggleDetails}
        className="text-blue-500 focus:outline-none underline"
      >
        {showDetails ? "Hide" : "View Details"}
      </button>

      <div>
        {isJobProgress && progressData.progress !== 101 ? (
          <ProgressBar
            showProgress={true}
            progress={progressData.progress}
            text={"Job progress:"}
          />
        ) : !isJobWaiting && !isJobCompleted && !isJobFailed ? (
          <div>Prepare data to Analyze...</div>
        ) : null}

        {/* <div>Waiting for server to analyze...</div> : null */}

        {isJobWaiting && <div>Waiting for analyze...</div>}
        {isJobCompleted && (
          <div className="mt-4 text-right">
            <ButtonComponent
              onClick={OnCompletedJobClick}
              children={<div>Go to Dashboard</div>}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobComponent;
