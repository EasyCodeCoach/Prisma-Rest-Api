import express from "express";
const router = express.Router();

import {
  registerUser,
  getuser,
  deleteuser,
  updateuser,
  getAllusers,
} from "../controllers/UserController.js";

router.route("/register").post(registerUser);

router.route("/:id").get(getuser);

router.route("/delete/:id").delete(deleteuser);

router.route("/update/:id").put(updateuser);

router.route("/all").get(getAllusers);

export default router;
