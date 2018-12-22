import { Document } from 'mongoose';

export interface IUserQuest extends Document {
    id?: string;
    userId?: string;
    questId?: string;
}
