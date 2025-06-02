// import mongoose from "mongoose"


// const connectDB = async () => {
//     try {
//         mongoose.connection.on('connected', () => console.log("Database Connected"));
//         await mongoose.connect(`${process.env.MONGODB_URI}/Hotel-Management`)
//     } catch (error) {
//         console.log(error.message);
        
//     }
// }

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("✅ Database Connected");
    });

    mongoose.connection.on('error', (err) => {
      console.log("❌ Database Connection Error:", err);
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (error) {
    console.log("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;