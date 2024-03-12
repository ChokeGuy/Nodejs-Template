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
    // Logic for user registration
    service.createOTP(req, res);
  }

  public verifyOTP(req: Request, res: Response): void {
    // Logic for user registration
    service.verifyOTP(req, res);
  }

  public refreshAccessToken(req: Request, res: Response): void {
    // Logic for user registration
    service.refreshAccessToken(req, res);
  }

  public updateProfiles(req: Request, res: Response): void {
    // Logic for user registration
    service.updateProfiles(req, res);
  }
}

export default UserController;
