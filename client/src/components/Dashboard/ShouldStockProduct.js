import React from "react";

const ShouldStockProduct = () => {
  // const [range, setRange] = useState([]);

  //   useEffect(() => {
  //     // Simulating data fetching from a database
  //     // Replace this with your actual data fetching logic
  //     const fetchDataFromDatabase = async () => {
  //       // Assume fetchDataFunction is a function that fetches data from your database
  //       const dynamicData = await fetchDataFunction();

  //       // Assuming dynamicData is an object with min and max properties
  //       const { min, max } = dynamicData;

  //       // Set the range state with the fetched data
  //       setRange([min, max]);
  //     };

  //     fetchDataFromDatabase();
  //   }, []);

  return (
    <div>
      <p className="pb-4">You should stock products</p>
      <div className="w-full flex items-center justify-center">
        <p className="text-5xl">
          {/* {range.length > 0 ? `${range[0]} - ${range[1]}` : "Loading..."} */}
          250 - 999
        </p>
      </div>
    </div>
  );
};

export default ShouldStockProduct;
