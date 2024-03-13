import { Request, Response } from "express";
import UserService from "../services/userService";

const service = new UserService();
class UserController {
  public getProfiles(req: Request, res: Response): void {
    // Logic to get all profiles
    service.getProfiles(req, res);
  }

  public login(req: Request, res: Response): void {
    // Logic for user login
    service.login(req, res);
  }

  public logout(req: Request, res: Response): void {
    // Logic for user logout
    service.logout(req, res);
  }

  public createOTP(req: Request, res: Response): void {
    // Logic for create OTP
    service.createOTP(req, res);
  }

  public verifyOTP(req: Request, res: Response): void {
    // Logic for verify OTP
    service.verifyOTP(req, res);
  }

  public refreshAccessToken(req: Request, res: Response): void {
    // Logic for refresh access token
    service.refreshAccessToken(req, res);
  }

  public updateProfiles(req: Request, res: Response): void {
    // Logic for update user profile
    service.updateProfiles(req, res);
  }

  public forgotPassword(req: Request, res: Response): void {
    // Logic for forgot password
    service.forgotPassword(req, res);
  }

  public resetPassword(req: Request, res: Response): void {
    // Logic for set new password
    service.resetPassword(req, res);
  }

  public changePassword(req: Request, res: Response): void {
    // Logic for change new password
    service.changePassword(req, res);
  }
}

export default UserController;
