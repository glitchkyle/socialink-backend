import express, { Request, Response, json } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import { rateLimit } from "express-rate-limit";
import { auth } from "express-openid-connect";

import Logger from "./config/logger";
import Morgan from "./config/morgan";
import { envs } from "./config/env";
import { PostgresDataSource } from "./database/datasources/postgres.datasource";
import postRouter from "./routes/post.route";
import errorLogger from "./middlewares/errorLogger";
import errorFormatter from "./middlewares/errorFormatter";

const app = express();
const port = envs.PORT;

PostgresDataSource.initialize()
    .then(() => {
        Logger.info("Database connected");
    })
    .catch((e) => {
        Logger.error(`Database initialization error: ${e.message}`);
        process.exit(1);
    });

const config = {
    authRequired: false,
    auth0Logout: true,
    idpLogout: true,
    issuerBaseURL: envs.ISSUER_BASE_URL,
    baseURL: envs.BASE_URL,
    clientID: envs.CLIENT_ID,
    secret: envs.SECRET,
};

app.use(auth(config));

// Enable CORS
app.use(cors());

// Body Parser
app.use(json());

// Cookie Parser
app.use(cookieParser());

// Security Headers
app.use(helmet());

// Morgan Logger
app.use(Morgan);

// Rate Limiting
app.use(
    rateLimit({
        windowMs: Number(envs.MAX_WINDOW_DURATION_SECONDS) * 1000,
        max: Number(envs.MAX_WINDOW_SIZE),
        message: "Too many requests from this IP, please try again later",
    })
);

app.use("/post", postRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Socialink API Server V1.0.0");
});

// Attach error logger and formatter
app.use(errorLogger);
app.use(errorFormatter);

app.listen(port, () => {
    Logger.info(`Server is running at port ${port}`);
});
