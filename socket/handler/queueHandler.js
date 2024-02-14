const { firestore } = require("../config/firebaseConfig");

const enqueueData = async (queueData, userid) => {
  try {
    const userRef = firestore.collection("users").doc(userid);
    const queueRef = userRef.collection("queue").doc("queueDocument");
    console.log(queueData);
    // const queueDataWithState = [];
    //   queueData.forEach((queue) => {
    //     const data = {
    //       userid: queue.userid,
    //       fileid: queue.fileid,
    //       state: state,
    //     };
    //     queueDataWithState.push(data);
    //   });

    if (queueData.length > 0) {
      await queueRef.set({ data: queueData });
      console.log("Queue data stored in Firebase Realtime Database");
    } else {
      await queueRef.delete();
      console.log("Queue data removed from Firebase Realtime Database");
    }
  } catch (error) {
    console.log("Error save queue data:", error);
  }
};

const getQueues = async (req, res) => {
  const userId = req.params.userid;
  try {
    const userRef = firestore.collection("users").doc(userId);
    const queueRef = userRef.collection("queue").doc("queueDocument");
    const queuesSnapshot = await queueRef.get();

    if (!queuesSnapshot.exists) {
      return res.status(404).json({ error: "Queues data not found" });
    }

    res.status(200).json(queuesSnapshot.data());
  } catch (error) {
    console.error("Error get queues data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { enqueueData, getQueues };
