import { Request, Response } from "express";
import bcrypt from "bcrypt";
import GenericResponse from "../dto/GenericResponse";
import User from "../models/userModel";
import redisConnection from "../lib/redisConnect";
import {
  accessTokenExpiration,
  addTokenToBlacklist,
  createTokens,
  getCredentialsFromAccessToken,
  getCredentialsFromRefreshToken,
  isRefreshTokenValid,
  refreshTokenExpiration,
} from "../lib/tokenManage";
import Role from "../constants/Role";
import sendEmail from "../lib/emailSending";
class UserService {
  constructor() {
    this.getProfiles = this.getProfiles.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    this.createOTP = this.createOTP.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  private createResponse(
    success: boolean,
    message: string,
    data: any,
    statusCode: number
  ) {
    return new GenericResponse(success, message, data, statusCode);
  }

  async createOTP(req: Request, res: Response) {
    try {
      const {
        username,
        password,
        confirmPassword,
        firstName,
        lastName,
        phoneNumber,
        birthday,
      } = req.body;
      const redis = await redisConnection();

      // Check if user already exists
      const existingUserInMongo = await User.findOne({ username });
      const checkExistingUserInRedis = await redis.get(`account:${username}`);

      if (existingUserInMongo || checkExistingUserInRedis) {
        return res
          .status(400)
          .json(
            this.createResponse(false, "Username already exists", null, 400)
          );
      }

      // Validate attributes
      if (
        !username ||
        !password ||
        !firstName ||
        !lastName ||
        !phoneNumber ||
        !birthday ||
        !confirmPassword
      ) {
        return res
          .status(400)
          .json(this.createResponse(false, "Invalid request data", null, 400));
      }

      // Check if password and confirm password match
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json(
            this.createResponse(
              false,
              "Password and confirm password do not match",
              null,
              400
            )
          );
      }

      // Check if username has email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(username)) {
        return res
          .status(400)
          .json(this.createResponse(false, "Invalid email format", null, 400));
      }

      // Check if phone number is valid Vietnamese phone number
      const phoneRegex =
        /^(\+?84|0)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])[0-9]{7}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res
          .status(400)
          .json(
            this.createResponse(false, "Invalid phone number format", null, 400)
          );
      }
      // Generate a random 6-digit OTP code
      const otpCode = Math.floor(100000 + Math.random() * 900000);

      // Store the OTP code in Redis
      await redis.set(`otp:${username}`, otpCode.toString(), {
        EX: 300, // Set expiration time for the OTP code
      });
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user in temporary state
      const newUser = new User({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        birthday,
        role: Role.USER,
      });
      await redis.set(`account:${newUser.username}`, JSON.stringify(newUser), {
        EX: 300, // Set expiration time for the OTP code
      });
      // Send an email to the user
      await sendEmail(username);
      res
        .status(200)
        .json(
          this.createResponse(
            true,
            "An email sent to " + username,
            newUser,
            200
          )
        );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(this.createResponse(false, "Internal server error", null, 500));
    }
  }
  async verifyOTP(req: Request, res: Response) {
    try {
      const { username, otp } = req.body;
      const redis = await redisConnection();
      const account = await redis.get(`account:${username}`);
      if (!account) {
        return res
          .status(400)
          .json(this.createResponse(false, "This email is invalid", null, 400));
      }
      // Check if OTP code is valid
      const storedOTP = await redis.get(`otp:${username}`);
      if (storedOTP !== otp) {
        return res
          .status(400)
          .json(this.createResponse(false, "Invalid OTP code", null, 400));
      }

      // Create a new user
      const newUser = new User({
        ...JSON.parse(account),
      });
      await newUser.save();
      await redis.del(`otp:${username}`);
      await redis.del(`account:${username}`);
      res
        .status(200)
        .json(
          this.createResponse(
            true,
            "User registered successfully",
            newUser,
            200
          )
        );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(this.createResponse(false, "Internal server error", null, 500));
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json(this.createResponse(false, "Username not existed", null, 400));
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json(this.createResponse(false, "Incorrect password", null, 400));
      }

      // Generate access token and refresh token
      const { accessToken, refreshToken } = await createTokens({
        userId: user._id,
        username: user.username,
        role: user.role,
      });
      const redisClient = await redisConnection();

      await redisClient.set(`accessToken:${user._id}`, accessToken, {
        EX: accessTokenExpiration,
      }); // Store access token in Redis with expiration time
      await redisClient.set(`refreshToken:${user._id}`, refreshToken, {
        EX: refreshTokenExpiration,
      }); // Store refresh token in Redis with expiration time

      // Set access token in response headers
      res.setHeader("Authorization", `Bearer ${accessToken}`);

      res.json(
        this.createResponse(
          true,
          "Login successfully",
          { accessToken, refreshToken },
          200
        )
      );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(this.createResponse(false, "Internal server error", null, 500));
    }
  }

  async getProfiles(req: Request, res: Response) {
    const accessToken = req.headers.authorization?.split(" ")[1];
    try {
      const credentials = getCredentialsFromAccessToken(accessToken || "");
      const redis = await redisConnection();
      // Check if data is cached
      const cachedProfiles = await redis.get(`profiles:${credentials.userId}`);
      if (cachedProfiles) {
        const profiles = JSON.parse(cachedProfiles);
        return res.json(this.createResponse(true, "Success", profiles, 200));
      }
      // Fetch data from database

      const users = await User.find({
        _id: credentials.userId,
        username: credentials.username,
      });
      if (!users || !users.length) {
        return res
          .status(404)
          .json(this.createResponse(false, "User not found", null, 404));
      }
      // Continue with the rest of the code
      // Cache the data
      await redis.set(`profiles:${credentials.userId}`, JSON.stringify(users));

      res.json(this.createResponse(true, "Success", users, 200));
    } catch (error) {
      res
        .status(500)
        .json(this.createResponse(false, "Internal server error", null, 500));
    }
  }

  async refreshAccessToken(req: Request, res: Response) {
    try {
      const rfToken = req.body.refreshToken;
      if (!isRefreshTokenValid(rfToken)) {
        return res
          .status(400)
          .json(this.createResponse(false, "Invalid refresh token", null, 400));
      }

      // Get user credentials from refresh token
      const user = getCredentialsFromRefreshToken(rfToken);

      // Generate access token and refresh token
      const { accessToken, refreshToken } = await createTokens(
        {
          userId: user.userId,
          username: user.username,
          role: user.role,
        },
        true
      );
      const redisClient = await redisConnection();
      const oldAccessToken = await redisClient.get(
        `accessToken:${user.userId}`
      );
      if (oldAccessToken) {
        const credentials = getCredentialsFromAccessToken(oldAccessToken);
        // Add access token to blacklist
        const expirationTime =
          credentials?.exp &&
          credentials?.iat &&
          credentials.exp - credentials.iat;
        await addTokenToBlacklist(
          oldAccessToken as string,
          credentials.userId,
          expirationTime
        );
      }
      await redisClient.set(`accessToken:${user.userId}`, accessToken, {
        EX: accessTokenExpiration,
      }); // Store access token in Redis with expiration time

      // Set access token in response headers
      res.setHeader("Authorization", `Bearer ${accessToken}`);

      res.json(
        this.createResponse(
          true,
          "Login successfully",
          { accessToken, refreshToken: rfToken },
          200
        )
      );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(this.createResponse(false, "Internal server error", null, 500));
    }
  }

  async logout(_req: Request, res: Response) {
    try {
      // Check if access token exists in redis
      const redis = await redisConnection();
      const accessToken = _req.headers.authorization?.split(" ")[1];
      const credentials = getCredentialsFromAccessToken(accessToken || "");
      const expirationTime =
        credentials?.exp &&
        credentials?.iat &&
        credentials.exp - credentials.iat;
      if (accessToken) {
        res.json(
          this.createResponse(true, "Logged out successfully", null, 200)
        );

        // Add access token to blacklist
        await addTokenToBlacklist(
          accessToken,
          credentials.userId,
          expirationTime
        );
        // Remove access token and refresh token from redis
        await redis.del(`profiles:${credentials.userId}`);
        await redis.del(`accessToken:${credentials.userId}`);
        await redis.del(`refreshToken:${credentials.userId}`);
      }
    } catch (error) {
      res
        .status(500)
        .json(this.createResponse(false, "Internal server error", null, 500));
    }
  }
}

export default UserService;
