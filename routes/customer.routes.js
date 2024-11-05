import express from "express";
import { addCustomer } from "../controllers/customer.controller.js";




const router = express.Router();

router.post("/add",addCustomer )




export default router;