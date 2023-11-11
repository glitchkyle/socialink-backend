import { PostgresDataSource } from "../database/datasources/postgres.datasource";
import Post from "../entities/post.entity";
import Logger from "../config/logger";
import { ResourceNotFoundError, ServerError } from "../handlers/error";

export const PostRepository = PostgresDataSource.getRepository(Post).extend({
    findPostById(postId: string) {
        Logger.debug(`Finding post ${postId}`);
        return Post.findOne({ where: { id: postId } });
    },
    createNewPost(post: Post) {
        Logger.debug("Creating new post");
        return post.save();
    },
    getPaginatedPostsAndCreator({
        pageNumber,
        pageSize,
    }: {
        pageNumber: number;
        pageSize: number;
    }) {
        Logger.debug(
            `Getting ${pageSize} posts and creators in page ${pageNumber}`
        );

        return Post.find({
            relations: { creator: true },
            skip: (pageNumber - 1) * pageSize,
            take: pageNumber,
        });
    },
    deletePostById(postId: string) {
        Logger.debug(`Deleting post ${postId}`);

        return Post.delete({ id: postId }).then((result) => {
            const { affected } = result;
            if (!affected) throw new ServerError();
            if (affected === 0)
                throw new ResourceNotFoundError("Post not found");

            return result;
        });
    },
});
