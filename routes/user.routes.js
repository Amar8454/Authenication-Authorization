import { Router } from "express";
import {
  registerUser,
  loginUser,
  loggedUser,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyUser, loggedUser);

export default router;
