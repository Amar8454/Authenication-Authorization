import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyUser = async (req, res, next) => {
  try {
    const accessToken =
      (await req.cookies?.accessToken) ||
      req.header("Autherization")?.replace("Bearer", "");

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized accessToken" });
    }

    const decode = jwt.verify(accessToken, process.env.JWT_SCERET);
    const user = await User.findById(decode?._id).select("-password")
    if(!user){
      return res.status(401).json({message: "Invalid access Token"})
    }

    req.user = user;
    next()
  } catch (error) {
    return res.status(500).json({error: error.message || error})
  }
};
