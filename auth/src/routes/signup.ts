import express, { Request, Response } from "express";
import { check, body } from "express-validator";
import { BadRequestError } from "./../errors/bad-request-error";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post("/api/users/signup",
  [
    check('email').normalizeEmail().isEmail(),
    check("password", "Password is invalid").trim().isLength({ min: 4, max: 20 })
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