import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { createUser, findUserByEmail } from "../repositories/userRepository.js";

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function signupUser({ name, email, password }) {
  if (!name || !email || !password) {
    throw createHttpError("Name, email, and password are required", 400);
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw createHttpError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, passwordHash });

  return sanitizeUser(user);
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw createHttpError("Email and password are required", 400);
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw createHttpError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw createHttpError("Invalid email or password", 401);
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw createHttpError("JWT secret is not configured", 500);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "1d" },
  );

  return {
    token,
    user: sanitizeUser(user),
  };
}