
import admin from 'firebase-admin';
import initializeFirebase from '../config/firebaseAdmin.js';

initializeFirebase();
const verifyFirebaseToken = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
  
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log(decodedToken,"decoded token");
      req.user = decodedToken;
      next();
    } catch (error) {
      console.log(error,'invalid token');
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  export default verifyFirebaseToken;