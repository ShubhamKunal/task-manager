const express = require("express");
const authRouter = express.Router();
const userController = require("../controllers/user_controller");

authRouter.post("/register", userController.registerUser);
authRouter.post("/login", userController.signInUserAndGetJwt);

module.exports = authRouter;