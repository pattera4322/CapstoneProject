import React from "react";
import ProgressBar from "../ProgressBar";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../Button/Button";
import DeleteButton from "../Button/DeleteButton";

const JobComponent = ({ job, progressData, index, userIdFromLocal }) => {
  const navigate = useNavigate();
  const isJobFailed = job.errorMessage !== undefined;
  const isJobCompleted = job.actualQuantityValues !== undefined;
  const isJobProgress =
    !isJobFailed && !isJobCompleted && job.state === "running";
  const isJobWaiting = !isJobFailed && !isJobCompleted && job.state === "wait";

  const OnCompletedJobClick = () => {
    console.log(JSON.stringify(job.data));
    if (job.actualQuantityValues) {
      navigate("/Dashboard", { replace: true, state: job.id });
    }
  };

  const handleCancelQueue = () => {};

  return (
    <div
      key={index}
      className={`transition ease-in-out hover:-translate-y-1 hover:scale-10 mx-16 my-8 px-8 py-8 rounded-md text-left shadow-[0px_10px_1px_rgba(221,221,221,1),0_10px_20px_rgba(204,204,204,1)]`}
    >
      {isJobWaiting && <div className="">
        <DeleteButton onClick={handleCancelQueue} children={"Cancel"} />
      </div>}

      {isJobProgress || isJobWaiting ? <div>IN QUEUE: {index + 1}</div> : null}

      <div>SLOT ID: {isJobProgress || isJobWaiting ? job.fileid : job.id}</div>
      
      {isJobCompleted || isJobFailed ? (
        <div>FILE NAME: {job.fileName || "Not found file name"}</div>
      ) : null}

      {job.errorMessage && <div>{job.errorMessage}</div>}
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
