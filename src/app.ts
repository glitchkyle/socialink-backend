import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import { rateLimit } from "express-rate-limit";
import { auth, requiresAuth } from "express-openid-connect";

import Logger from "./config/logger";
import Morgan from "./config/morgan";

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

// Enable CORS
app.use(cors());

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Security Headers
app.use(helmet());

// Morgan Logger
app.use(Morgan);

// Rate Limiting
app.use(
    rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 100,
        message: "Too many requests from this IP, please try again later",
    })
);

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
