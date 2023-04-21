import { prisma } from "../utils/prismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * create user
 * @auth required
 * @route {POST} /api/v1/user/register
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
 * login
 * @auth not required
 * @route {POST} /api/v1/user/login
 * @returns token
 */
export const loginUser = async (req, res) => {
  //    get the user from req.body
  const { email, password } = req.body;
  //   check if the user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    // check if the password matches to the one in the db
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (comparePassword) {
      // sign the token
      const payload = {
        userId: user.id,
      };
      jwt.sign(
        payload,
        process.env.JWTSECRET,
        {
          expiresIn: "30d",
        },
        (err, token) => {
          if (err || !token) {
            return res.status(401).json("token was not found");
          }
          return res.status(200).json({
            token: token,
          });
        }
      );
    }
  }
};

/**
 * get single user
 * @auth required
 * @route {GET} /api/v1/user/
 * @returns requested  user
 */
export const getuser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
  });

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  res.json({ user });
};

/**
 * delete single
 * @auth required
 * @route {DELETE} /api/v1/user/delete/{{id}}
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
  if (user.id !== req.userId) {
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
 * @route {PUT} /api/v1/user/update/{{id}}
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
  if (user.id !== req.userId) {
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
 * @route {GET} /api/v1/user/users/all
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
