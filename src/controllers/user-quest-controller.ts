import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { IUserQuest } from '../interfaces/user-quest';
import { Result } from '../models/result';
import { UserSchema } from '../schemas/user';
import { QuestSchema } from '../schemas/quest';
import { UserQuestSchema } from '../schemas/user-quest';
import { IQuest } from '../interfaces/quest';
import { IUser } from '../interfaces/user';

const User = mongoose.model<IUser>('User', UserSchema);
const Quest = mongoose.model<IQuest>('Quest', QuestSchema);
const UserQuest = mongoose.model<IUserQuest>('UserQuest', UserQuestSchema);

export class UserQuestController {

    public async answerOnQuest(answer, questId, userId: string) {
        const user = await User.findById(userId);
        const quest = await Quest.findById(questId);
        if (quest && user) {
            if (quest.answers.indexOf(answer) != -1) {
                return await this.addQuestToUser(user, quest)
            } else {
                return new Result(400, { message: 'quest or user not found' })
            }
        } else {
            return new Result(200, { message: false})
        }
    }

    private async addQuestToUser(user: IUser, quest: IQuest) {
        try {
            const newUserQuest = new UserQuest({
                userId: user.id,
                questId: quest.id
            });
            const res = await newUserQuest.save();
            return new Result(200, res);
        } catch (err) {
            return new Result(500, err);
        }
    } 
}

export const userQuestController = new UserQuestController();
