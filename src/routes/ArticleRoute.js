import express from "express";
import {
  createArticle,
  getArticle,
  deleteArticle,
  updateArticle,
  getAllArticles,
} from "../controllers/ArticleController.js";

const router = express.Router();

router.route("/create").post(createArticle);

router.route("/:id").get(getArticle);

router.route("/remove/:id").delete(deleteArticle);

router.route("/update/:id").put(updateArticle);

router.route("/").get(getAllArticles);

export default router;
