const { firestore } = require("../config/firebaseConfig");

const saveData = async (req, res) => {
  try {
    const userRef = firestore.collection("users").doc(req.params.userid);
    await userRef.set(req.body); // Assuming req.body contains the user data

    res.status(200).json({ message: "User data saved successfully" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error get user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getHistoryData = async (req, res) => {
  const userId = req.params.userid;
  const fileId = req.params.fileid;
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

      const historyRef = userRef.collection("history").doc(fileId);
      const historySnapshot = await historyRef.get();

      if (historySnapshot.exists) {
        const historyData = {
          fileId: historySnapshot.id,
          history: historySnapshot.data(),
        };

        res.status(200).json({ data: { userData, historyData } });
      } else {
        res
          .status(404)
          .json({ error: "History data not found for the specified file ID" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error get history data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllHistoryData = async (req, res) => {
  const userId = req.params.userid;
  try {
    const userRef = firestore.collection("users").doc(userId);
    const userDocSnapshot = await userRef.get();
    
    if (!userDocSnapshot.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const historyRef = userRef.collection("history");
    const historySnapshot = await historyRef.get();
    if (historySnapshot.empty) {
      return res
        .status(404)
        .json({ error: "History data not found for the specified user" });
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

    // console.log(`Histories data:`, historyData);
    res.status(200).json({ data: historyData });
  } catch (error) {
    console.error("Error get history data:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  getData,
  getHistoryData,
  saveHistoryData,
  getAllHistoryData,
};
