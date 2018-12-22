import { IUser } from '../interfaces/user';

export class User {

    constructor(user: IUser) {
        this.id = user.id;
        this.name = user.name;
        this.login = user.login;
        this.score = user.score;
        this.questCount = user.questCount;
        this.enabled = user.enabled;
        this.passwordHash = user.passwordHash;
    }

    id: string;
    name: string;
    login: string;
    score: number;
    questCount: number;
    enabled: boolean;
    passwordHash: string;
}
