import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Changed _id to clerkId
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  firstName: { type: String }, // Added new fields
  lastName: { type: String },
  role: { type: String, enum: ["user", "hotelOwner"], default: "user" },
  recentSearchedCities: [{ type: String }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;