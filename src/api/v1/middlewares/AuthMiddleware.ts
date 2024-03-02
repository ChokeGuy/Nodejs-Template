import { Request, Response, NextFunction } from "express";
import GenericResponse from "../dto/GenericResponse";
import jwt from "jsonwebtoken";
// Pseudo code for AuthMiddleware
function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  // Get access token from header
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  // Check if access token is provided
  if (!accessToken) {
    return res
      .status(401)
      .json(
        new GenericResponse(
          false,
          "A token is required for authentication",
          undefined,
          401
        )
      );
  }
  //Verify access token
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_TOKEN_SECRET as string
    );
    (req as any).user = decoded;
    return next();
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json(new GenericResponse(false, "Invalid Token", undefined, 400));
  }
}
export default AuthMiddleware;
