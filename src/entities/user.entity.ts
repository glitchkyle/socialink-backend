import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Entity, Column, OneToMany } from "typeorm";
import BaseEntityModel from "./base.entity";
import Auth from "./auth.entity";
import Post from "./post.entity";

export enum EUserRole {
    REGULAR = "Regular",
    ADMIN = "Admin",
}

@Entity("users")
export default class User extends BaseEntityModel {
    @Column()
    @IsNotEmpty()
    @IsString()
    username: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ name: "full_name" })
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @Column({ name: "profile_picture_url" })
    @IsNotEmpty()
    @IsString()
    profilePictureUrl: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    locale: string;

    @Column({ type: "enum", enum: EUserRole, default: EUserRole.REGULAR })
    role: EUserRole;

    @OneToMany(() => Auth, (auth) => auth.user, { onDelete: "CASCADE" })
    authentications?: Auth[];

    @OneToMany(() => Post, (post) => post.creator, { onDelete: "CASCADE" })
    posts?: Post[];
}
