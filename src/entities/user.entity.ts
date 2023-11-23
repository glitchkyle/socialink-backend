import { IsEmail } from "class-validator";
import { Entity, Column, OneToMany } from "typeorm";
import BaseEntityModel from "./base.entity";
import Auth from "./auth.entity";
import Post from "./post.entity";

@Entity("users")
export default class User extends BaseEntityModel {
    @Column({ nullable: true })
    username?: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ name: "full_name", nullable: true })
    fullName?: string;

    @Column({ name: "profile_picture_url", nullable: true })
    profilePictureUrl?: string;

    @Column({ nullable: true })
    locale?: string;

    @OneToMany(() => Auth, (auth) => auth.user, { onDelete: "CASCADE" })
    authentications?: Auth[];

    @OneToMany(() => Post, (post) => post.creator, { onDelete: "CASCADE" })
    posts?: Post[];
}
