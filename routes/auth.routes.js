import express from "express";
import { verifyOTP } from "../controllers/auth.controller.js";
import verifyFirebaseToken from "../middlewares/verifyIdToken.js";




const router = express.Router();



router.post("/verifyOTP",verifyFirebaseToken, verifyOTP);



export default router;