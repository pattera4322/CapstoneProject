const { firestore } = require("../config/firebaseConfig");

const createInsightData = async (req, res) => {
  try {
    const userRef = firestore.collection("users").doc(req.params.userid);
    const historyRef = userRef.collection("insight").doc(req.params.fileid)
    await historyRef.set(req.body);
    res.status(200).json({
      ResponseCode: 200,
      ResponseMessage: "Insight data saved successfully",
    });
  } catch (error) {
    console.log("Error save Insight data:", error);
    return res.status(500).json({
      ResponseCode: 500,
      ResponseMessage: "Internal server error.",
    });
  }
};


const updateInsightData = async (req, res) => {
    try {
      const userRef = firestore.collection("users").doc(req.params.userid);
      const historyRef = userRef.collection("insight").doc(req.params.fileid)
      await historyRef.update(req.body);
      res.status(200).json({
        ResponseCode: 200,
        ResponseMessage: "Insight data updated successfully",
      });
    } catch (error) {
      console.log("Error update Insight data:", error);
      return res.status(500).json({
        ResponseCode: 500,
        ResponseMessage: "Internal server error.",
      });
    }
  };

  module.exports = {
    createInsightData,
    updateInsightData
  };