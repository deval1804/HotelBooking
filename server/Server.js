import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import clerkWebHooks from "./api/clerk.js";

// Connect DB
connectDB();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());  // 👈 Yeh pehle hona chahiye har API ke liye

// Webhook endpoint
app.post("/api/clerk", clerkWebHooks);

// Test route
app.get("/", (req, res) => res.send("API is working"));

// Port config
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
