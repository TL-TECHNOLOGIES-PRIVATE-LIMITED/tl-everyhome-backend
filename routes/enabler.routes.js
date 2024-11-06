import express from "express";
import { addAddress,  register } from "../controllers/enabler.controller.js";




const router = express.Router();


router.post("/login", register);
router.post("/addAddress", addAddress);




export default router;