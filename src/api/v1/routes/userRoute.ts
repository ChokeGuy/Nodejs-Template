import express from "express";
import UserController from "../controllers/userController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { upload } from "../lib/imageUpload";

const userRouter = express.Router();
const userController = new UserController();

//Create OTP code
userRouter.post("/register/create-otp", userController.createOTP);

// Route to register a new user
userRouter.post("/register/verify-otp", userController.verifyOTP);

// Route to get new password for user
userRouter.post("/forgot-password", userController.forgotPassword);

// Route to set new password
userRouter.post("/reset-password", userController.resetPassword);

// Route to change new password
userRouter.post(
  "/change-password",
  AuthMiddleware,
  userController.changePassword
);

// Route to login
userRouter.post("/login", userController.login);

// Route to get all user profiles
userRouter.get("/profiles", AuthMiddleware, userController.getProfiles);

// Update user profile
userRouter.patch(
  "/profiles/update",
  AuthMiddleware,
  upload.single("avatar"),
  userController.updateProfiles
);

// Route to logout
userRouter.post("/logout", AuthMiddleware, userController.logout);

// Route to refresh access token
userRouter.post("/refresh-token", userController.refreshAccessToken);

export default userRouter;
