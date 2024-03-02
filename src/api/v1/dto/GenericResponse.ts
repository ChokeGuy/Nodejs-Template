import { Response } from "express";

class GenericResponse extends Response {
  success: boolean;
  message: string;
  result: object;
  statusCode: number;
  
  constructor(
    success: boolean,
    message: string,
    result: any,
    statusCode: number
  ) {
    super();
    this.success = success;
    this.message = message;
    this.result = result;
    this.statusCode = statusCode;
  }
}
export default GenericResponse;