import express from "express";
import dotenv from "dotenv";
import connectedDB from "./db/mongodbURL.js";
import router from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/api/v1/users", router);
const PORT = process.env.PORT || 8080;

connectedDB();

app.listen(PORT, (req, res) => {
  console.log(`server is running on ${PORT}`);
});
