import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";

import BaseEntityModel from "./base.entity";
import User from "./user.entity";
import { IsNotEmpty, IsString } from "class-validator";

@Entity("auth")
export default class Auth extends BaseEntityModel {
    @ManyToOne(() => User, (user) => user.authentications)
    @JoinColumn({ name: "auth_user_id" })
    user?: User;

    // This field stores the unique identifier provided by the
    // OAuth provider for the authenticated user. It allows you to link
    // the user's authentication information to their corresponding account
    // in your application's database.
    @Column({ name: "subject_id", unique: true })
    @IsNotEmpty()
    @IsString()
    subjectId: string;

    // This field stores the access token obtained during the OAuth authentication
    // process. The access token is used to access protected resources on behalf of
    // the user and typically has a limited lifespan.
    @Column({
        type: "text",
        name: "access_token",
        nullable: true,
        default: null,
    })
    accessToken: string | null;

    // This field stores the refresh token obtained during the OAuth authentication
    // process. The refresh token is used to obtain a new access token when the current
    // access token expires. It allows for long-term access to the user's resources without
    // requiring the user to reauthenticate.
    @Column({
        type: "text",
        name: "refresh_token",
        nullable: true,
        default: null,
    })
    refreshToken: string | null;

    // This field stores the expiration time of the OAuth access token. It helps track
    // when the access token will expire, allowing you to handle token refresh operations
    // efficiently and ensure uninterrupted access to the user's resources.
    @Column({
        type: "timestamptz",
        name: "access_token_expires_at",
        nullable: true,
        default: null,
    })
    accessTokenExpiresAt: Date | null;
}
