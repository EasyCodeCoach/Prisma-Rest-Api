import express from "express";
import {
  createArticle,
  getArticle,
  deleteArticle,
  updateArticle,
  getAllArticles,
} from "../controllers/ArticleController.js";
import { authenticateToken } from "../utils/verifyToken.js";

const router = express.Router();

router.route("/create").post(authenticateToken, createArticle);

router.route("/:id").get(getArticle);

router.route("/remove/:id").delete(authenticateToken, deleteArticle);

router.route("/update/:id").put(authenticateToken, updateArticle);

router.route("/").get(getAllArticles);

export default router;
