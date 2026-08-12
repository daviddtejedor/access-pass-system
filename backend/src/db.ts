import mongoose from "mongoose";
import dotenv from "dotenv";
import { setupCronJobs } from "./libs/cronJob";
dotenv.config();

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI no está definida");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI!);
    setupCronJobs();
    console.log("---DB is connected---");
  } catch (e) {
    console.log(e);
  }
};
export default connectDB;
