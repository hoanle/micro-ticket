import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "./../errors/request-vadilation-error";
import { BadRequestError } from "./../errors/bad-request-error";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post("/api/users/signup",
  [
    body('email')
      .isEmail()
      .withMessage("Email is invalid"),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password is invalid")
  ],
  validateRequest,
  async (request: Request, response: Response) => {

    const { email, password } = request.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = await User.build({ email, password });
    await user.save();

    //Generate jsonwebtoken 
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);

    //Store it on session object
    request.session = {
      jwt: userJwt
    }

    response.status(201).send(user);
  })

export { router as singupRouter }