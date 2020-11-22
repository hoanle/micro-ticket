import expres, { Response, NextFunction, Request } from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
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
        secure: false
    }));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(singupRouter);
app.all('*', async (request: Request, response: Response, next: NextFunction) => {
    throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT must be defined");
    }
    
    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } catch (error) {
        console.log(error)
    }

    app.listen(3000, () => {
        console.log("Listening to port 3000!!");
    });
}

start();