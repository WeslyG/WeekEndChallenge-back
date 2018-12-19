import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import { Result } from '../models/result';
import { IQuest } from '../interfaces/quest';
import { QuestSchema } from '../schemas/quest';
import { IQuestResult } from '../interfaces/questResult';

const Quest = mongoose.model<IQuest>('Quest', QuestSchema);

export class QuestController {

    // GET one quest 
    public async getQuest(questId: string) {
        try {
            const quest = await Quest.findById(questId);
            if (!quest) {
                return new Result(400, { message: 'quest invalid'});
            }
            return new Result(200, {
                id: quest.id,
                name: quest.name,
                tag: quest.tag,
                price: quest.price,
                description: quest.description,
            });
        } catch (err) {
            return new Result(500, err);
        }
    }

    // New Quest
    public async newQuest(quest: IQuest) {
        try {
            const exist = await Quest.findOne({ name: quest.name });
            if (!exist) {
                // TODO: попробовать типизировать
                const newQuest = new Quest
                    ({
                        name: quest.name,
                        tag: quest.tag,
                        price: quest.price,
                        description: quest.description,
                        answers: quest.answers
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
                answers: quest.answers
            };
            const newQuest = await Quest.findOneAndUpdate(query, update, { new: true });

            return new Result(200, {
                id: newQuest.id,
                name: newQuest.name,
                description: newQuest.description,
                tag: newQuest.tag,
                price: newQuest.price,
                answers: newQuest.answers
            });
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }

    // Delete Quest
    // public async deleteQuest(quest: IQuest) {
    //     try {
    //         const query = { '_id': quest.id };
    //         const deleteQuest = await Quest.findOneAndDelete(query);
    //         console.log(deleteQuest);
    //         return new Result(200, deleteQuest);
    //     } catch (err) {
    //         console.log(err);
    //         return new Result(500, err);
    //     }
    // }

    public async getQuestList() {
        try {
            // const test = await this.getQuestForAnswer();
            const questlist = await Quest.find();
            const tagList = this.getTags(questlist);
            const returnList = [];
            // console.log(test);
            // console.log(questlist);

            _(tagList).forEach((value: string) => {
                returnList.push({
                    tag: value,
                    quests: _.filter(questlist, { 'tag': value })
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

    private async getQuestForAnswer() {
        // TODO:
        const result = [];
        const questlist = await Quest.find();
        _(questlist).forEach((res) => {
            result.push({
                id: res._id,
                name: res.name,
                price: res.price,
                tag: res.tag
            })
            result.push(res)
        });
        return result;
    }

}

export const questController = new QuestController();