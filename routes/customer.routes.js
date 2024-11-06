import express from "express";
import { addAddress, login } from "../controllers/customer.controller.js";




const router = express.Router();

router.post("/login", login);
router.post("/addAddress", addAddress);



export default router;