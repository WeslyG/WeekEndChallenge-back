import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import { Result } from '../models/result';
import { IQuest } from '../interfaces/quest';
import { QuestSchema } from '../schemas/quest';
import { Quest } from '../models/questReturnModel';
import { UserQuestSchema } from '../schemas/user-quest';
import { IUserQuest } from '../interfaces/user-quest';


const QuestModel = mongoose.model<IQuest>('Quest', QuestSchema);
const UserQuest = mongoose.model<IUserQuest>('UserQuest', UserQuestSchema);

export class QuestController {

    // GET one quest 
    public async getQuest(questId, userId: string) {
        try {
            const quest = await QuestModel.findById(questId);
            if (!quest) {
                return new Result(400, { message: 'quest invalid'});
            }
            const completed = await UserQuest.find({questId, userId});
            return new Result(200, {
                id: quest.id,
                name: quest.name,
                tag: quest.tag,
                price: quest.price,
                description: quest.description,
                completed: completed.length === 0 ? false : true
            });
        } catch (err) {
            return new Result(500, err);
        }
    }

    // New Quest
    public async newQuest(quest: IQuest) {
        try {
            const exist = await QuestModel.findOne({ name: quest.name });
            if (!exist) {
                // TODO: попробовать типизировать (проблема с extends Documents)
                const newQuest = new QuestModel
                    ({
                        name: quest.name,
                        tag: quest.tag,
                        price: quest.price,
                        description: quest.description,
                        answers: quest.answers,
                        enabled: quest.enabled
                    });
                const result = await newQuest.save();
                return new Result(201, result);
            } else {
                return new Result(409, { message: 'quest exist' });
            }
        } catch (err) {
            return new Result(500, err);
        }
    }

    // Update Quest
    public async updateQuest(quest: IQuest) {
        // TODO: update one field
        try {
            const query = { '_id': quest.id };
            const update = {
                name: quest.name,
                description: quest.description,
                tag: quest.tag,
                price: quest.price,
                enabled: quest.enabled,
                answers: quest.answers
            };
            const newQuest = await QuestModel.findOneAndUpdate(query, update, { new: true });

            return new Result(200, {
                id: newQuest.id,
                name: newQuest.name,
                description: newQuest.description,
                tag: newQuest.tag,
                price: newQuest.price,
                enabled: quest.enabled,
                answers: newQuest.answers
            });
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }

    public async getQuestList(userId?: string) {
        try {
            const questlist = await QuestModel.find({ enabled: true });
            const tagList = this.getTags(questlist);
            let templateList = [];
            const returnList = [];

            if (userId) {
                const completed = await this.getQuestIdForUser(userId);
                _(questlist).forEach(v => {
                    if (completed.indexOf(v.id) === -1) {
                        templateList.push({
                            id: v.id,
                            name: v.name,
                            tag: v.tag,
                            price: v.price,
                            description: v.description,
                            completed: false
                        })
                    } else {
                        templateList.push({
                            id: v.id,
                            name: v.name,
                            tag: v.tag,
                            price: v.price,
                            description: v.description,
                            completed: true
                        })
                    }
                })
            } else {
                templateList = questlist;
            }

            _(tagList).forEach((value: string) => {
                const quest = templateList.map(q => new Quest(q));
                returnList.push({
                    tag: value,
                    quests: _.filter(quest, { 'tag': value })
                });
            });
            return new Result(200, returnList);
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }

    public async getQuestList2(userId?: string) {
        try {
            const questlist = await QuestModel.find({ enabled: true });
            const tagList = this.getTags(questlist);
            const templateList = [];
            const returnList = [];

            if (userId) {
                const completed = await this.getQuestIdForUser(userId);
                _(questlist).forEach(v => {
                    if (completed.indexOf(v.id) === -1) {
                        templateList.push({
                            id: v.id,
                            name: v.name,
                            tag: v.tag,
                            price: v.price,
                            description: v.description,
                            completed: false
                        })
                    } else {
                        templateList.push({
                            id: v.id,
                            name: v.name,
                            tag: v.tag,
                            price: v.price,
                            description: v.description,
                            completed: true
                        })
                    }
                })
            }

            _(tagList).forEach((value: string) => {
                const quest = templateList.map(q => new Quest(q));
                returnList.push({
                    tag: value,
                    quests: _.filter(quest, { 'tag': value })
                });
            });
            return new Result(200, returnList);
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }

    private getTags(questList: IQuest[]) {
        const returnList: string[] = [];
        _(questList).forEach((value: IQuest) => {
            if (_.indexOf(returnList, value.tag) === -1) {
                returnList.push(value.tag);
            }
        });
        return returnList;
    }

    private async getQuestIdForUser(userId: string) {
        const returnlist = [];
        const completed = await UserQuest.find(
            { userId },
            ['questId']);

        _(completed).forEach(v => {
            returnlist.push(v.questId)
        })
        return returnlist;
    }
}

export const questController = new QuestController();