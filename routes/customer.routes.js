import express from "express";
import { addAddress, updateDefaultAddress} from "../controllers/customer.controller.js";
import verifyFirebaseToken from "../middlewares/verifyIdToken.js";




const router = express.Router();

router.post("/add-address", verifyFirebaseToken ,addAddress);
router.patch('/update-default-address/:addressId', verifyFirebaseToken, updateDefaultAddress);


export default router;