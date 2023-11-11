import { DeepPartial } from "typeorm";
import { isNumber, validate } from "class-validator";

import Logger from "../config/logger";
import { PostRepository } from "../repositories/post.repository";
import Post from "../entities/post.entity";
import {
    BadRequestError,
    ResourceNotFoundError,
    ValidationException,
} from "../handlers/error";

export async function getPaginatedPosts({
    pageNumber,
    pageSize,
}: {
    pageNumber: number;
    pageSize: number;
}) {
    Logger.debug(`Getting ${pageSize} posts in page ${pageNumber}`);

    if (!isNumber(pageNumber))
        throw new BadRequestError("Page number must be a number");

    if (!isNumber(pageSize))
        throw new BadRequestError("Page size must be a number");

    return PostRepository.getPaginatedPostsAndCreator({ pageNumber, pageSize });
}

export async function createNewPost(newPost: DeepPartial<Post>) {
    Logger.debug("Creating new user post");

    const post = Post.create(newPost);

    const errors = await validate(post);
    if (errors.length) throw new ValidationException(errors);

    return PostRepository.createNewPost(post);
}

export async function findAndDeleteUserPost(postId: string) {
    Logger.debug(`Finding and deleting post id ${postId}`);

    const post = await PostRepository.findPostById(postId);
    if (!post) throw new ResourceNotFoundError("Post not found");

    await PostRepository.deletePostById(postId);

    return post;
}
