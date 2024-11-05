import express from "express";
import 'dotenv/config';
import connectDB from "./config/db.js";





const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    connectDB();
    console.log("Server is running on port " + port);
});