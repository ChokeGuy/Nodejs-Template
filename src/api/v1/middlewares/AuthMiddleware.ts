import { Request, Response, NextFunction } from "express";
import GenericResponse from "../dto/GenericResponse";
import { isAccessTokenValid, isTokenBlacklisted } from "../lib/tokenManage";

// Pseudo code for AuthMiddleware
async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  // Get access token from header
  // Check if access token exists in headers
  const accessToken = req.headers.authorization?.split(" ")[1] as string;
  if (!accessToken) {
    return res
      .status(401)
      .json(new GenericResponse(false, "Authorization Token Required", null, 401));
  } else if (
    !isAccessTokenValid(accessToken) ||
    (await isTokenBlacklisted(accessToken))
  ) {
    return res
      .status(400)
      .json(new GenericResponse(false, "Invalid access token", null, 400));
  }
  return next();
}
export default AuthMiddleware;
