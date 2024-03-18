const { firestore } = require("../config/firebaseConfig");

const enqueueData = async (queueData) => {
  try {
    const queueRef = firestore.collection("queues").doc("queueDocument");
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
      await queueRef.set( {queueData });
      console.log("Queue data stored in Firebase Realtime Database");
    } else {
      await queueRef.delete();
      console.log("Queue data removed from Firebase Realtime Database");
    }
  } catch (error) {
    console.log("Error save queue data:", error);
    throw error;
  }
};

const getQueues = async (req, res) => {
  const userId = req.params.userid;
  try {
    const userRef = firestore.collection("queues").doc("queueDocument");
    const queuesSnapshot = await userRef.get();

    if (!queuesSnapshot.exists) {
      return res.status(404).json({
        ResponseCode: 404,
        ResponseMessage: "Queues data not found",
      });
    }
    const queuesData = queuesSnapshot.data().queueData;
    const filterQueuesData = queuesData.filter(
      (queue) => queue.userid === userId
    );
    res.status(200).json(filterQueuesData);
  } catch (error) {
    console.error("Error get queues data:", error);
    res.status(500).json({
      ResponseCode: 500,
      ResponseMessage: "Internal server error.",
    });
  }
};

module.exports = { enqueueData, getQueues };
