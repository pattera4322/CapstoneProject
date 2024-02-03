import React from "react";
import ProgressBar from "../ProgressBar";

const JobComponent = ({ job, progressData }) => {
  const isJobActive = job.state === "active";
  const isJobWaiting = job.state === "waiting"
  console.log("this is progressdata id", progressData.jobId);

  return (
    <div
      className={`transition ease-in-out hover:-translate-y-1 hover:scale-10 mx-16 my-8 px-8 py-8 rounded-md text-left shadow-[0px_10px_1px_rgba(221,221,221,1),0_10px_20px_rgba(204,204,204,1)]`}
    >
      <div>Job ID: {job.id}</div>
      {/* Uncomment the line below if job.name is available */}
      {/* <div>Job Name: {job.name}</div> */}
      <div>Job Data: {JSON.stringify(job.data)}</div>
      <div>Job State: {job.state}</div>
      <div>
        {isJobActive && (
          <ProgressBar
            showProgress={true}
            progress={progressData.progress}
            text={"Job progress:"}
          />
        )}
        {isJobWaiting && <div>Waiting for analyze...</div>}
      </div>
    </div>
  );
};

export default JobComponent;
