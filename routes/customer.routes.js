import express from "express";
import { adduser } from "../controllers/customer.controller.js";




const router = express.Router();

router.post("/add",adduser )




export default router;