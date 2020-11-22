import express from "express";
import { currentUser } from "./../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, requireAuth, (request, response) => {
  response.send({ currentUser: request.currentUser || null })
})

export { router as currentUserRouter }