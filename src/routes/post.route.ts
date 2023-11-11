import { Router } from "express";

import {
    createPost,
    deletePost,
    getPosts,
} from "../controllers/post.controller";
import { authorize, protect } from "../middlewares/auth.middleware";
import { EUserRole } from "../entities/user.entity";
import { requiresAuth } from "express-openid-connect";

const postRouter = Router({ mergeParams: true });

postRouter
    .route("/")
    .get(requiresAuth(), protect, getPosts)
    .post(requiresAuth(), protect, createPost);

postRouter
    .route("/:postId")
    .delete(requiresAuth(), protect, authorize(EUserRole.ADMIN), deletePost);

export default postRouter;
