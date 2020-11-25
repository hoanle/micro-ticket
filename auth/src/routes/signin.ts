import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/api/users/signin",
  [
    body('email')
      .isEmail()
      .withMessage("Email is invalid"),
    body('password')
      .trim()
      .notEmpty()
      .withMessage("Must supply password")
  ],
  validateRequest,
  async (request: Request, response: Response) => {

    const { email, password } = request.body;

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials");
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    //Generate jsonwebtoken 
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!);

    //Store it on session object
    request.session = {
      jwt: userJwt
    }

    response.status(200).send(existingUser);
  })

export { router as signinRouter }