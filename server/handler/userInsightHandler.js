const { firestore } = require("../config/firebaseConfig");

const createInsightData = async (req, res) => {
  try {
    const userRef = firestore.collection("users").doc(req.params.userid);
    const insightRef = userRef.collection("insight").doc(req.params.fileid);
    await insightRef.set(req.body);
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
    const insightRef = userRef.collection("insight").doc(req.params.fileid);
    await insightRef.update(req.body);
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

const getInsightData = async (req, res) => {
  try {
    const userRef = firestore.collection("users").doc(req.params.userid);
    const insightRef = userRef.collection("insight");
    const insightSnapshot = await insightRef.get();

    if (insightSnapshot.empty) {
      return res.status(404).json({
        ResponseCode: 404,
        ResponseMessage: `Insight data not found`,
      });
    }

    const insightData = [];

    insightSnapshot.forEach((insightDoc) => {
      const data = {
        id: insightDoc.id,
        ...insightDoc.data(),
      };
      insightData.push(data);
    });

    res.status(200).json({ data: insightData });
  } catch (error) {
    console.log("Error get Insight data:", error);
    return res.status(500).json({
      ResponseCode: 500,
      ResponseMessage: "Internal server error.",
    });
  }
};

module.exports = {
  createInsightData,
  updateInsightData,
  getInsightData
};
