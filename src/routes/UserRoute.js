import express from "express";
const router = express.Router();
import {
  registerUser,
  getuser,
  deleteuser,
  updateuser,
  getAllusers,
  loginUser,
} from "../controllers/UserController.js";
import { authenticateToken } from "../utils/verifyToken.js";

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/").get(authenticateToken, getuser);

router.route("/delete/:id").delete(authenticateToken, deleteuser);

router.route("/update/:id").put(authenticateToken, updateuser);

router.route("/users/all").get(getAllusers);

export default router;
