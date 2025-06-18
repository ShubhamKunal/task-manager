import express from "express";
const userController = require("../controllers/user_controller");
const { authenticateJWT } = require("../middleware/check_auth");  

const userRouter = express.Router();

userRouter.get("/me", authenticateJWT, userController.getLoggedInUserByHeader);
// userRouter.get("/", authenticateJWT, userController.getUsersExceptPassword);
// userRouter.get("/:id", authenticateJWT, userController.getUserById);

module.exports = userRouter;