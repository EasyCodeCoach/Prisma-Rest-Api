import { prisma } from "../utils/prismaClient.js";

/**
 * create articles
 * @auth required
 * @route {POST} /api/v1/article/create
 * @returns created article
 */
export const createArticle = async (req, res) => {
  const article = await prisma.article.create({
    include: {
      author: true,
    },
    data: {
      title: req.body.title,
      content: req.body.content,
      authorId: req.userId,
    },
  });

  article.author.password = undefined;

  res.json({ article });
};

/**
 * get single
 * @auth required
 * @route {GET} /api/v1/article/:id
 * @returns requested  article
 */
export const getArticle = async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: true,
    },
  });

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.json({ article });
};

/**
 * delete single
 * @auth required
 * @route {DELETE} /api/v1/article/remove/{{id}}
 * @returns
 */
export const deleteArticle = async (req, res) => {
  const { id } = req.params;

  const article = await prisma.article.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: true,
    },
  });

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  // Check that the authenticated user is the author of the article
  if (article.authorId !== req.userId) {
    return res
      .status(403)
      .json({ error: "You do not have permission to delete this article" });
  }

  await prisma.article.delete({
    where: { id: parseInt(id) },
  });

  res.json({ message: "Article deleted successfully" });
};

/**
 * update single
 * @auth required
 * @route {PUT} /api/v1/article/update/{{id}}
 * @returns updated  article
 */
export const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const article = await prisma.article.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: true,
    },
  });

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  // Check that the authenticated user is the author of the article
  if (article.authorId !== req.userId) {
    return res
      .status(403)
      .json({ error: "You do not have permission to update this article" });
  }

  const updatedArticle = await prisma.article.update({
    where: { id: parseInt(id) },
    data: {
      title,
      content,
    },
    include: {
      author: true,
    },
  });

  res.json({ article: updatedArticle });
};

/**
 *  get all articles
 * @auth not required
 * @route {GET} /api/v1/article
 * @returns get all  articles
 */
export const getAllArticles = async (req, res) => {
  const articles = await prisma.article.findMany({
    include: {
      author: true,
    },
  });

  res.json({ articles });
};
