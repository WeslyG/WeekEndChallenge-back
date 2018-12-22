import { Document } from 'mongoose';
import { Gender } from '../enums/gender';

export interface IUser extends Document {
    id?: string;
    name?: string;
    login?: string;
    gender?: Gender;
    score?: number;
    passwordHash?: string;
}
