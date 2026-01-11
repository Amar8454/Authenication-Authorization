import { Router } from "express";
import {
  registerUser,
  loginUser,
  loggedUser,
  getUserProfile,
  getAllUser,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyUser, loggedUser);
router.get("/get_user_profile", verifyUser, getUserProfile);
router.get("/get_all_user", verifyUser, getAllUser);

export default router;
