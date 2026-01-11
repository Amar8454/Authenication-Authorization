import mongoose from "mongoose";
import { DB_Name } from "../constant.js";

const connectedDB = async (req, res) => {
  try {
    mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
    .then(() => {
      console.log("MongoDB connected ");
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "MongoDB connection Failed" });
  }
};

export default connectedDB;
