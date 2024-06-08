import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../constants.js";

const connectDB = async() => {
  try {
    await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    console.log("MongoDB Connection Successful");
  } catch(error) {
    console.log("MongoDB Connection Failed! ", error);

    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

export { connectDB };