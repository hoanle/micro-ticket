import expres, { Response, NextFunction, Request } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current_user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { singupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = expres();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  }));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(singupRouter);
app.all('*', async (request: Request, response: Response, next: NextFunction) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };