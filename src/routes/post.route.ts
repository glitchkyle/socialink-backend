import { Router } from "express";

import {
    createPost,
    deletePost,
    getPosts,
} from "../controllers/post.controller";
import { requiresAuth } from "express-openid-connect";
import { authorize } from "../middlewares/auth.middleware";

const postRouter = Router({ mergeParams: true });

postRouter
    .route("/")
    .get(requiresAuth(), authorize("read:posts"), getPosts)
    .post(requiresAuth(), authorize("create:posts"), createPost);

postRouter
    .route("/:postId")
    .delete(requiresAuth(), authorize("delete:posts"), deletePost);

export default postRouter;
