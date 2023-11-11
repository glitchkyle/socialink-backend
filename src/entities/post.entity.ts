import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import BaseEntityModel from "./base.entity";
import User from "./user.entity";
import { IsNotEmpty, IsString } from "class-validator";

@Entity("posts")
export default class Post extends BaseEntityModel {
    @Column()
    @IsNotEmpty()
    @IsString()
    content: string;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: "creator_id" })
    creator?: User;
}
