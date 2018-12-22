import { Document } from 'mongoose';

export interface IQuest extends Document {
    id?: string;
    name?: string;
    tag?: string;
    price?: number;
    description?: string;
    enabled: boolean;
    answers?: Array<string>;
}
