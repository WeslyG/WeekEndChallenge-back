import { Gender } from "../enums/gender";

export interface IUser {
    id?: string;
    name?: string;
    email?: string;
    birthDay?: Date;
    gender?: Gender;
    passwordHash?: string;
}

// TODO
// export interface IUser extends mongoose.Document