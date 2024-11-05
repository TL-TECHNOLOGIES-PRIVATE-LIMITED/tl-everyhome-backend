import express from "express";
import 'dotenv/config';
import cors from "cors";
import connectDB from "./config/db.js";
import customerRoutes from "./routes/customer.routes.js";
import enablerRoutes from "./routes/enabler.routes.js";





const app = express();
const port = process.env.PORT || 5000;

// middlewares


// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/enabler", enablerRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to Every-home-be");
});

app.listen(port, () => {
    connectDB();
    console.log("Server is running on port " + port);
});