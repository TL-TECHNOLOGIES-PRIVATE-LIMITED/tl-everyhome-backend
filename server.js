import express from "express";
import 'dotenv/config';
import customerRoutes from "./routes/customer.routes.js";
import enablerRoutes from "./routes/enabler.routes.js";
import authRoutes from "./routes/auth.routes.js";




const app = express();
const port = process.env.PORT || 5000;

// middlewares


// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/enabler", enablerRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to Every-home-be");
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});