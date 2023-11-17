import React from "react";
import html2canvas from "html2canvas";

const ButtonDownload = () => {
  const handleScreenshot = () => {
    const rootElement = document.getElementById("root"); // or the ID of the element you want to capture
    if (rootElement) {
      html2canvas(rootElement).then((canvas) => {
        // Convert canvas to image data
        const imageData = canvas.toDataURL("image/png");

        // Create a link element
        const downloadLink = document.createElement("a");
        downloadLink.href = imageData;
        downloadLink.download = "screenshot.png";

        // Simulate click on the link to trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    }
  };

  return (
    <div>
      <button
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center ml-auto"
        onClick={handleScreenshot}
      >
        <svg
          className="fill-current w-4 h-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
        </svg>
        Download
      </button>
    </div>
  );
};

export default ButtonDownload;
