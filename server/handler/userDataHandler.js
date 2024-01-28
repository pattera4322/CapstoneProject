const { firestore } = require("../config/firebaseConfig");

const saveData = async (req, res) => {
    try {
      const userRef = firestore.collection('users').doc(req.params.userid);
      await userRef.set(req.body); // Assuming req.body contains the user data
  
      res.status(200).json({ message: 'User data saved successfully' });
    } catch (error) {
      console.error('Error saving user data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports = { saveData };