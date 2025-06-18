const userServices = require("../services/user_services");
import { Request, Response } from "express";
const { registerSchema, loginSchema } = require("../validator/user_validators");

const getUsersExceptPassword = async function (req: Request, res: Response) {
  try {
    const users = await userServices.getUsersExceptPassword();
    res.json({
      status: "success",
      data: users,
      meta: {
        count: users.length,
      },
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err,
    });
  }
};
const getUserById = async function (req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await userServices.getUserById(userId);
    if (user) {
      res.json({
        status: "success",
        data: user,
      });
    } else {
      res.status(404).json({ status: "error", error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res
      .status(500)
      .json({ status: "error", message: "Internal Server Error", error: err });
  }
};

const registerUser = async function (req: Request, res: Response) {
  const { error } = registerSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    console.error("Validation error:", error.details);
    return res.status(400).json({ status: "error",
        message: "Validation Error",
        error: error.details, });
  }
  try {
    const userData = req.body;
    const savedUser = await userServices.registerUser(userData);
    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: savedUser,
    });
  } catch (err) {
    console.error("Error registering user:", err);
  res
      .status(500)
      .json({ status: "error", message: "Internal Server Error", error: err });
  }
};
const signInUserAndGetJwt = async function (req: Request, res: Response) {
  const { error } = loginSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    console.error("Validation error:", error.details);
    return res.status(400).json({ status: "error",
        message: "Validation Error",
        error: error.details, });
  }
  try {
    const { email, password } = req.body;
    const token = await userServices.signInUserAndGetJwt(email, password);
    if (token) {
      res.json({ 
        status: "success",
        message: "User signed in successfully",
        token: token });
    } else {
      res.status(401).json({  status: "error",
        message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Error signing in user:", err);
    res
      .status(500)
      .json({ status: "error", message: "Internal Server Error", error: err });
  }
};

const getLoggedInUserByHeader = async function (req: Request, res: Response) {
  console.log("getLoggedInUserByHeader called");
  const loggedInUser = await userServices.getLoggedInUserByHeader(req, res);
  console.log("Logged in user:", loggedInUser);
  if (loggedInUser) {
    res.json({
        status: "success",
        message: "User fetched successfully",
        data: loggedInUser,
    });
  } else {
    res
      .status(401)
      .json({ status: "error", message: "Unauthorized" });
  }
};

module.exports = {
  getUsersExceptPassword,
  getUserById,
  registerUser,
  signInUserAndGetJwt,
  getLoggedInUserByHeader,
};
