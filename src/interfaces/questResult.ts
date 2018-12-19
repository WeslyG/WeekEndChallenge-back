import { IQuest } from "./quest";
import { Document } from "mongoose";

export interface IQuestResult extends Document {
        tag?: string,
        quests?: IQuest[]
}