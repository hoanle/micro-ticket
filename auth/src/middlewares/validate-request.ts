import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "./../errors/request-vadilation-error";

export const validateRequest = (error: Error, request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request);
  
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
}