import { Gender } from "../enums/gender";

export class UserModel {
    constructor(id?: string, name?: string, email?: string, birthDay?: Date, gender?: Gender, passwordHash?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.birthDay = birthDay;
        this.gender = gender;
        this.passwordHash = passwordHash;
    }

    id: string;
    name: string;
    email: string;
    birthDay: Date;
    gender: Gender;
    passwordHash: string;
}
