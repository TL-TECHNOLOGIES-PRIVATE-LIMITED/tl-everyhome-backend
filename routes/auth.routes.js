import express from "express";
import { createAccount, getUser} from "../controllers/auth.controller.js";
import verifyFirebaseToken from "../middlewares/verifyIdToken.js";




const router = express.Router();



router.post("/create-account",verifyFirebaseToken, createAccount);
router.get("/getUser",verifyFirebaseToken, getUser);


export default router;