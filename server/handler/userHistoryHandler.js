const { firestore } = require("../config/firebaseConfig");

// get history data by history id
const getHistoryDataById = async (req, res) => {
  const userId = req.params.userid;
  const historyId = req.params.historyid;
  try {
    const userRef = firestore.collection("users").doc(userId);
    const userDocSnapshot = await userRef.get();

    if (userDocSnapshot.exists) {
      const insightRef = userRef.collection("insight").doc(historyId);
      const insightSnapshot = await insightRef.get();

      if (insightSnapshot.exists) {
        const userData = {
          riskLevel: insightSnapshot.data().riskLevel,
          leadTime: insightSnapshot.data().leadTime,
          salesGoal: insightSnapshot.data().salesGoal,
          fileName: insightSnapshot.data().fileName,
          costPerProductStorage: insightSnapshot.data().costPerProductStorage,
          costPerOrder: insightSnapshot.data().costPerOrder,
        };
        console.log(userData);

        const historyRef = userRef.collection("history").doc(historyId);
        const historySnapshot = await historyRef.get();

        if (historySnapshot.exists) {
          const historyData = {
            fileId: historySnapshot.id,
            history: historySnapshot.data(),
          };

          res.status(200).json({ data: { userData, historyData } });
        } else {
          res.status(404).json({
            ResponseCode: 404,
            ResponseMessage: `History data not found for historyId ${historyId}`,
          });
        }
      } else {
        res.status(404).json({
          ResponseCode: 404,
          ResponseMessage: `Insight data not found for historyId ${historyId}`,
        });
      }
    } else {
      res.status(404).json({
        ResponseCode: 404,
        ResponseMessage: `User not found`,
      });
    }
  } catch (error) {
    res.status(500).json({
      ResponseCode: 500,
      ResponseMessage: `Internal Server Error`,
    });
  }
};

const getAllHistoryData = async (req, res) => {
  const userId = req.params.userid;
  try {
    const userRef = firestore.collection("users").doc(userId);
    //const userDocSnapshot = await userRef.get();

    const historyRef = userRef.collection("history");
    const historySnapshot = await historyRef.get();
    if (historySnapshot.empty) {
      return res.status(404).json({
        ResponseCode: 404,
        ResponseMessage: `History data not found`,
      });
    }

    const historyData = [];

    historySnapshot.forEach((historyDoc) => {
      const data = {
        historyid: historyDoc.id,
        analyzedTime: historyDoc.data().analyzedSuccessTime,
        state:
          historyDoc.data().errorMessage === undefined ? "success" : "fail",
        errorMessage: historyDoc.data().errorMessage,
      };
      historyData.push(data);
    });

    res.status(200).json({ data: historyData });
  } catch (error) {
    console.log("Error get history data:", error);
    res.status(500).json({
      ResponseCode: 500,
      ResponseMessage: "Internal server error.",
    });
  }
};

const saveHistoryData = async (data, userid, historyId) => {
  try {
    const userRef = firestore.collection("users").doc(userid);
    const historyRef = userRef.collection("history").doc(historyId);
    await historyRef.set(data);
  } catch (error) {
    console.log("Error save history data:", error);
  }
};

const checkHistoryDataReachLimit = async (userId) => {
  try {
    const userRef = firestore.collection("users").doc(userId);
    const historyRef = userRef.collection("history");

    const historyDocCount = await historyRef.count().get();
    // if(historyDocCount.data().count === 5){
    //     return true
    // }
    // return false
    return historyDocCount.data().count;
  } catch (error) {
    console.log("Error check History Data Reach Limit 5: ", error);
    throw error;
  }
};

module.exports = {
  getHistoryDataById,
  saveHistoryData,
  getAllHistoryData,
  checkHistoryDataReachLimit,
};
