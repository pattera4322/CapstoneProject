import React, { useEffect, useState, useRef } from "react";
import "../index.css";
import StepperSection from "../components/Home/Stepper";
import DetailSection from "../components/Home/DetailSection";
import Button3D from "../components/Button/Button3D";
import { postUserData, getUserData } from "../api/userDataApi";
import { showErrorAlert } from "../utils/SwalAlert";
import LoadingPage from "../components/LoadingPage";

function HomePage() {
  const StepSection = useRef(null);
  const [toggleIn, setToggleIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scrolldown = () => {
    StepSection.current?.scrollIntoView({ behavior: "smooth" });
  };
  const toggleInstruction = () => {
    setToggleIn(!toggleIn);
  };

  useEffect(() => {
    setIsLoading(true);
    postUserData({ fileName: {}, analyzeLimit: 0 })
      .then(() => {
        setIsLoading(false);
        localStorage.setItem("fileName", JSON.stringify({}));
        localStorage.setItem("analyzeLimit", JSON.stringify(0));
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 409) {
            setIsLoading(true);
            getUserData()
              .then((res) => {
                if (res.data) {
                  localStorage.setItem(
                    "fileName",
                    JSON.stringify(res.data.fileName)
                  );
                  localStorage.setItem(
                    "analyzeLimit",
                    JSON.stringify(res.data.analyzeLimit)
                  );
                }
                setIsLoading(false);
              })
              .catch((error) => {
                setIsLoading(false);
                if (error.response) {
                  showErrorAlert("Something went wrong!", `${error.response}`);
                }
              });
              
          } else {
            setIsLoading(false);
            showErrorAlert("Something went wrong!", `${error.response}`);
          }
        }
      });
      setIsLoading(false);
  }, []);

  return (
    <div className="pt-32 grid grid-cols-2 gap-4 content-center">
      <LoadingPage loading={isLoading} />
      {/*<------------------------------ Section 1 Introduce web application ------------------------------> */}
      {/* <div className="mt-10 text-center px-4 sm:px-8 col-span-3"> */}
      <div className="mt-10 text-left px-4 sm:px-8 col-span-1 ml-20">
        <h1 className="text-6xl sm:text-6xl font-bold">
          Step into a Smarter <br />
          Retail Experience!
        </h1>
        <div className="text-base sm:text-lg mt-6 text-left">
          <p>Maximize the potential of your workforce by automating</p>
          <p>complex tasks and optimizing workflows with our</p>
          <p>predictive stocking data.</p>
        </div>
        <div className="pr-8 pt-8 sm:pt-10 pb-10 bg-no-repeat bg-bottom bg-auto">
          <span className="pr-4 py-4">
            <Button3D
              onClick={toggleInstruction}
              children={"Read Instructions"}
            />
          </span>

          <span>
            <Button3D onClick={scrolldown} children={"Let’s get started"} />
          </span>
        </div>
      </div>

      {!toggleIn ? (
        <div
        className={`grid grid-cols-subgrid h-33 col-span-1 transition-transform translate-x-0 duration-1000 relative`}
      >
        <img
          src={process.env.PUBLIC_URL + "/assets/SmartStockHomeBG.svg"}
          alt="SmartStock Home"
          className="inset-0 mx-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
        />
        <img
          src={process.env.PUBLIC_URL + "/assets/Icon2.svg"}
          alt="Icon1"
          className="absolute mx-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl -mt-16 animate-floating"
        />
        <img
          src={process.env.PUBLIC_URL + "/assets/Icon1.svg"}
          alt="Icon1"
          className="absolute mx-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl -mt-16 animate-floating-2"
        />
      </div>
      ) : null}

      {toggleIn ? (
        <div
          className={`pl-0 pr-24 pt-24 opacity-100 transition-opacity duration-1000`}
        >
          {toggleIn && <DetailSection />}
        </div>
      ) : null}

      {/*<------------------------------ Section 2 Stepper------------------------------> */}

      <div
        className="importSection pr-4 pl-4 sm:pr-20 sm:pl-20 grid grid-cols-subgrid gap-4 col-span-3"
        ref={StepSection}
      >
        <StepperSection />
      </div>
    </div>
  );
}

export default HomePage;
