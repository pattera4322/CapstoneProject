const { firestore } = require("../config/firebaseConfig");

const saveData = async (req, res) => {
  try {
    const userRef = firestore.collection("users").doc(req.params.userid);
    await userRef.set(req.body); // Assuming req.body contains the user data
    res.status(200).json({
      ResponseCode: 200,
      ResponseMessage: "User data saved successfully",
    });
  } catch (error) {
    console.log("Error saving user data:", error);
    return res.status(500).json({
      ResponseCode: 500,
      ResponseMessage: "Internal server error.",
    });
  }
};

const updateData = async (req, res) => {
  try {
    const userRef = firestore.collection("users").doc(req.params.userid);
    await userRef.update(req.body); // Assuming req.body contains the user data
    res.status(200).json({
      ResponseCode: 200,
      ResponseMessage: "User data saved successfully",
    });
  } catch (error) {
    console.log("Error saving user data:", error);
    return res.status(500).json({
      ResponseCode: 500,
      ResponseMessage: "Internal server error.",
    });
  }
};

const getData = async (req, res) => {
  const userId = req.params.userid;
  try {
    const userRef = firestore.collection("users").doc(userId);
    const userDocSnapshot = await userRef.get();

    if (userDocSnapshot.exists) {
      const userData = {
        riskLevel: userDocSnapshot.data().riskLevel,
        leadTime: userDocSnapshot.data().leadTime,
        salesGoal: userDocSnapshot.data().salesGoal,
        fileName: userDocSnapshot.data().fileName,
        costPerProductStorage: userDocSnapshot.data().costPerProductStorage,
        costPerOrder: userDocSnapshot.data().costPerOrder,
      };

      res.status(200).json({ data: { userData } });
    } else {
      res.status(404).json({
        ResponseCode: 404,
        ResponseMessage: "User datas not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ResponseCode: 500,
      ResponseMessage: "Internal server error.",
    });
  }
};

const getHistoryData = async (req, res) => {
  const userId = req.params.userid;
  const fileId = req.params.fileid;
  try {
    const userRef = firestore.collection("users").doc(userId);
    const userDocSnapshot = await userRef.get();

    if (userDocSnapshot.exists) {
      const insightRef = userRef.collection("insight").doc(fileId);
      const insightSnapshot = await insightRef.get();

      if (insightSnapshot.exists) {
        const userData = {
          riskLevel: insightSnapshot.data().riskLevel,
          leadTime: insightSnapshot.data().leadTime,
          salesGoal: insightSnapshot.data().salesGoal,
          fileName: userDocSnapshot.data().fileName,
          costPerProductStorage: insightSnapshot.data().costPerProductStorage,
          costPerOrder: insightSnapshot.data().costPerOrder,
        };
        console.log(userData);

        const historyRef = userRef.collection("history").doc(fileId);
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
            ResponseMessage: `History data not found for fileid ${fileId}`,
          });
        }
      } else {
        res.status(404).json({
          ResponseCode: 404,
          ResponseMessage: `Insight data not found for fileid ${fileId}`,
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
    const userDocSnapshot = await userRef.get();

    if (!userDocSnapshot.exists) {
      return res.status(404).json({
        ResponseCode: 404,
        ResponseMessage: `User not found`,
      });
    }

    const historyRef = userRef.collection("history");
    const historySnapshot = await historyRef.get();
    if (historySnapshot.empty) {
      return res.status(404).json({
        ResponseCode: 404,
        ResponseMessage: `History data not found`,
      });
    }
    const historyData = [];
    historySnapshot.forEach((doc) => {
      const data = {
        id: doc.id,
        fileName: userDocSnapshot.data().fileName[doc.id],
        ...doc.data(),
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

const saveHistoryData = async (data, userid, fileid) => {
  try {
    const userRef = firestore.collection("users").doc(userid);
    const historyRef = userRef.collection("history").doc(fileid);
    await historyRef.set(data);
  } catch (error) {
    console.log("Error save history data:", error);
  }
};

module.exports = {
  saveData,
  updateData,
  getData,
  getHistoryData,
  saveHistoryData,
  getAllHistoryData,
};
