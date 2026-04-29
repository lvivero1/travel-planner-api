import { loginUser, signupUser } from "../services/authService.js";

export async function signup(req, res, next) {
  try {
    const user = await signupUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}