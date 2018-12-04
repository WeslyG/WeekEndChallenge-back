import { Gender } from '../enums/gender';

export interface IUser {
    id?: string;
    name?: string;
    login?: string,
    gender?: Gender;
    score?: number,
    passwordHash?: string;
}