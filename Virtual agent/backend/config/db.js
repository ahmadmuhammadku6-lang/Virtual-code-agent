import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from .env");
  }

  try {
    const uri = new URL(mongoUri);
    const username = decodeURIComponent(uri.username);

    if (!username || username.includes("<db_username>")) {
      throw new Error("Replace <db_username> in MONGO_URI with your Atlas database username");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
