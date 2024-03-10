import express from "express";
import UserController from "../controllers/userController";
import AuthMiddleware from "../middlewares/AuthMiddleware";

const userRouter = express.Router();
const userController = new UserController();
// Route to get all user profiles
userRouter.get("/profiles", AuthMiddleware, userController.getProfiles);

//Create OTP code
userRouter.post("/register/create-otp", userController.createOTP);

// Route to register a new user
userRouter.post("/register/verify-otp", userController.verifyOTP);

// Route to login
userRouter.post("/login", userController.login);

// Route to refresh access token
userRouter.post("/refresh-token", userController.refreshAccessToken);

// Route to logout
userRouter.post("/logout", AuthMiddleware, userController.logout);

export default userRouter;
