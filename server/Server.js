import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'


connectDB()

////fndsjfdfnf
const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing


// Middleware
app.use(express.json());
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server on port ${PORT}:`, err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});