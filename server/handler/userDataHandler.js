const { firestore } = require("../config/firebaseConfig");

const saveData = async (req, res) => {
  try {
    const userRef = firestore.collection("users").doc(req.params.userid);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      return res.status(409).json({
        ResponseCode: 409,
        ResponseMessage: "User data already exists.",
      });
    }
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
        fileName: userDocSnapshot.data().fileName,
        analyzeLimit: userDocSnapshot.data().analyzeLimit
      };

      res.status(200).json({ data: userData  });
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

const getAnalyzeLimit = async (userId) => {
  try {
    const userRef = firestore.collection("users").doc(userId);
    const userDocSnapshot = await userRef.get();
    return userDocSnapshot.data().analyzeLimit;
  } catch (error) {
    console.log("Error check analyze Reach Limit 5: ", error);
    throw error;
  }
};

module.exports = {
  saveData,
  updateData,
  getData,
  getAnalyzeLimit
};
