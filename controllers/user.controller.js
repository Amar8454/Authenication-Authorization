import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    if (
      [fullName, username, email, password].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      res.status(400).json({ message: "All fields required" });
    }

    const existUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      username,
      password,
    });

    const createUser = await User.findOne(user._id).select("-password");
    if (!createUser) {
      return res.status(404).json({ message: "User not available in Db" });
    }

    return res
      .status(200)
      .json({ createUser, message: "user successfully created" });
  } catch (error) {
    return res.status(500).json({ error: error.message || message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!password && !email) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({
      $or: [{ password }, { email }],
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid password and email" });
    }

    const isPassword = await user.isPasswordCorrect(password);
    if (!isPassword) {
      return res.status(404).json({ message: "Invalid password" });
    }

    // generate accessToken
    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
      process.env.JWT_SCERET,
      {
        expiresIn: process.env.JWT_EXPIRY_DATE,
      }
    );

    const option = {
      httpOlny: true,
      secure: true,
    };

    const userLogin = await User.findById(user._id).select("-password ");

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .json({ user: userLogin, message: "User LoggedIn" });
  } catch (error) {
    return res.status(500).json({ error: error.message || message });
  }
};

export const loggedUser = async (req, res) => {
  try {
    const option = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", option)
      .json({ message: "User LogOUt" });
  } catch (error) {
    return res.status(500).json({ error: error.message || error });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(400).json({ message: "User not exist" });
    }

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const AllUser = await User.find().select("-password");
    console.log(AllUser);
    if (!AllUser) {
      return res.status(400).json({ message: "User not Available" });
    }

    return res.status(200).json({ success: true, user: AllUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

