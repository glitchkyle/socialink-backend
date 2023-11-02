import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { auth, requiresAuth } from "express-openid-connect";
import Logger from "./config/logger";

dotenv.config();

const app = express();
const port = process.env.PORT;

const config = {
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
};

app.use(auth(config));

app.get("/", (req: Request, res: Response) => {
    res.send("Express + Typescript Server");
});

app.get("/", (req: Request, res: Response) => {
    res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get("/profile", requiresAuth(), (req: Request, res: Response) => {
    res.send(JSON.stringify(req.oidc.user));
});

app.listen(port, () => {
    Logger.info(`Server is running at port ${port}`);
});
