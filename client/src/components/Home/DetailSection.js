import React from "react";

const DetailSection = () => {
  return (
    <div className=" overflow-y-auto h-96 grid grid-cols-subgrid gap-4 col-span-1">
      <h1 className="text-2xl">
        <b>Instructions</b>
      </h1>
      <div className="px-10 py-1.5 text-left">
        <label className="text-lg text-gray-500">
          {/* <b> */}
            Welcome to our Sales and Inventory Prediction Web Application! This
            guide will walk you through the necessary steps to provide the
            required data, understand limitations, and access valuable insights
            from the analysis.
          {/* </b> */}
        </label>
        <br />
        <br />
        <label className="text-lg">
          <b>1. Data Input Requirements</b>
        </label>
        <div className="text-s pl-4 pt-1.5">
          <p>
            To ensure accurate predictions and insightful analysis, we require
            the following data:
          </p>
          <ul className="list-disc pl-4">
            <li>
              <b>Date</b>: Input the date of the sales transaction. Use the
              specified date format (e.g., YYYY-MM-DD).
            </li>
            <li>
              <b>Product Name/Product Category</b>: Specify the name or category
              of the product.
            </li>
            <li>
              <b>Price per Unit</b>: Enter the unit price of the product.
            </li>
            <li>
              <b>Quantity</b>: Specify the quantity of units sold.
            </li>
            <li>
              <b>Total Sales</b>: Provide the total sales amount for the
              transaction. If available, provide the total sales. Note that
              having price per unit and quantity is sufficient; total sales is
              optional.
            </li>
          </ul>
          <p className="text-lg pt-5">
            <b>Data Input Template</b>
          </p>
          <ol class="list-decimal pl-4">
            <li>
              Download Template: Click <u>here</u> or download template in step
              2 to download the data input template.
            </li>
            <li>
              Fill in Data: Enter your data into the template, following the
              specified formats.
            </li>
            <li>Save Template: Save the completed template.</li>
          </ol>
          <p className="pt-5">
            Please note the following format requirements to align with the
            template to maintain data integrity and ensure accurate predictions:
          </p>
          <ul className="list-disc pl-4">
            <li>Date Format: Use the format YYYY-MM-DD (e.g., 2024-01-17).</li>
            <li>
              Product Name/Product Category Format: Ensure the name or category
              follows standard text conventions.
            </li>
            <li>
              Price per Unit, Quantity, and Total Sales: Ensure the type of
              value is a number.
            </li>
          </ul>
        </div>
        <div className="pt-5">
          <label className="text-lg">
            <b>2. Data Submission</b>
          </label>
          <div className="text-s pl-4 pt-1">
            <p>
              Once you have filled in the data in the template, follow these
              steps to submit it:
            </p>
            <ol className="list-decimal pl-4">
              <li>
                Please click next step navigate you to step 3 for upload filled
                template.
              </li>
              <li>
                Upload Template: Find the option to upload data, and upload the
                completed template.
              </li>
              <li>
                Submit Data: Click the submit button to upload your data for
                analysis.
              </li>
            </ol>
          </div>
        </div>
        <div className="pt-5">
          <label className="text-lg">
            <b>3. Analysis Insights</b>
          </label>
          <div className="text-s pl-4 pt-1">
            <p>
              Upon submitting the required data, you can expect the following
              insights:
            </p>
            <ul className="list-disc pl-4">
              <li>
                Dashboard: Access a user-friendly dashboard presenting a visual
                representation of sales and inventory trends.
              </li>
              <li>
                Analysis Insights: Receive detailed analysis insights, providing
                a deeper understanding of the data and potential areas for
                improvement.
              </li>
              <li>
                Safety Stock Recommendations: Get recommendations for
                maintaining optimal safety stock levels based on historical data
                and predictive analytics.
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-5">
          <label className="text-lg">
            <b>4. Trust and Data Handling</b>
          </label>
          <div className="text-s pl-4 pt-1">
            <p>
              We want to assure you of our commitment to data privacy and
              security:
            </p>
            <ul className="list-disc pl-4">
              <li>
                Data Storage: Your data is securely stored in Firebase, ensuring
                reliability and accessibility for predictions and analysis.
              </li>
              <li>
                Purpose: The collected data is utilized exclusively for
                predicting sales and inventory trends, providing you with
                valuable insights to optimize your business operations.
              </li>
            </ul>
          </div>
        </div>
        <br />
        <br />
        <label className="text-lg text-gray-500">
            Thank you for choosing our Sales and Inventory Prediction Web
            Application. We trust that this tool will empower you to make
            informed decisions and enhance the efficiency of your business. If
            you have any further questions or concerns, please refer to our
            support documentation or reach out to our customer service team.
            Happy analyzing!
        </label>
        <br />
        <br />
      </div>
    </div>
  );
};

export default DetailSection;
