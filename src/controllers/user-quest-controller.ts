import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { IUserQuest } from '../interfaces/user-quest';
import { Result } from '../models/result';
import { UserSchema } from '../schemas/user';
import { QuestSchema } from '../schemas/quest';
import { UserQuestSchema } from '../schemas/user-quest';
import { IQuest } from '../interfaces/quest';
import { IUser } from '../interfaces/user';
import { userController } from './user-controller';
import { Quest } from '../models/questReturnModel';

const User = mongoose.model<IUser>('User', UserSchema);
const QuestModel = mongoose.model<IQuest>('Quest', QuestSchema);
const UserQuest = mongoose.model<IUserQuest>('UserQuest', UserQuestSchema);

export class UserQuestController {

    public async answerOnQuest(answer, questId, userId: string) {
        const user = await User.findById(userId);
        const quest = await QuestModel.findById(questId);
        const exist = await this.existUserQuest(userId, questId);

        if (exist === true) {
            return new Result(200, { message: 'answer exist' });
        }
        if (quest && user) {
            if (quest.answers.indexOf(answer) !== -1) {
                return await this.addQuestToUser(user, quest);
            } else {
                return new Result(200, { message: false });
            }
        } else {
            return new Result(400, { message: 'quest or user not found' });
        }
    }

    public async getQuestsByUser(user: IUser) {
        try {
            const userQuests = await UserQuest.find({ userId: user.id });
            const ids = userQuests.map(q => q.questId);
            const questFromDb = await QuestModel.find({ _id: ids });

            const result = questFromDb.map(q => new Quest(q));
            return result;
        } catch (err) {
            return err;
        }

    }

    private async addQuestToUser(user: IUser, quest: IQuest) {
        try {
            const newUserQuest = new UserQuest({
                userId: user.id,
                questId: quest.id
            });
            await newUserQuest.save();
            await userController.addScoreForQuest(user, quest);
            return new Result(200, { message: true});
        } catch (err) {
            return new Result(500, err);
        }
    }

    private async existUserQuest(userId, questId: string) {
        try {
            const data = await UserQuest.find({ userId, questId});
            if (data[0]) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return err;
        }
    }


}

export const userQuestController = new UserQuestController();
