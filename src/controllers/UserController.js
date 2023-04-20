import { prisma } from "../utils/prismaClient.js";
import bcrypt from "bcryptjs";

/**
 * create user
 * @auth required
 * @route {POST} /user/create
 * @returns created user
 */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return res.status(400).json("user already exists");
  }

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({ user: createdUser });
};

/**
 * get single user
 * @auth required
 * @route {GET} /user/
 * @returns requested  user
 */
export const getuser = async (req, res) => {
  const user = await prisma.article.findUnique({
    where: { id: parseInt(req.userId) },
    include: {
      author: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  res.json({ user });
};

/**
 * delete single
 * @auth required
 * @route {DELETE} /user/delete/{{id}}
 * @returns removed  user
 */
export const deleteuser = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Check that the authenticated user is the same as the user being deleted
  if (user.id !== req.user.id) {
    return res
      .status(403)
      .json({ error: "You do not have permission to delete this user" });
  }

  await prisma.user.delete({
    where: { id: parseInt(id) },
  });

  res.json({ message: "User deleted successfully" });
};

/**
 * update single
 * @auth required
 * @route {PUT} /user/update/{{id}}
 * @returns updated  user
 */
export const updateuser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Check that the authenticated user is the same as the user being updated
  if (user.id !== req.user.id) {
    return res
      .status(403)
      .json({ error: "You do not have permission to update this user" });
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      name,
      email,
    },
  });

  res.json({ user: updatedUser });
};

/**
 *  get all users
 * @auth required
 * @route {GET} /users/{{id}}
 * @returns all users
 */
export const getAllusers = async (req, res) => {
  const users = await prisma.user.findMany({
    include: {
      articles: true,
    },
  });

  return res.status(200).json({
    users,
  });
};
