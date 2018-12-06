import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import { Result } from '../models/result';
import { IQuest } from '../interfaces/quest';
import { QuestSchema } from '../schemas/quest';

const Quest = mongoose.model('Quest', QuestSchema);

export class QuestController {
    // GET one quest 
    public async getQuest(questId: string) {
        try {
            const quest = await <IQuest>Quest.findById(questId);
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
            console.log(err);
            return new Result(500, err);
        }
    }
    
    // New Quest
    public async newQuest(name, tag, description: string, price: number, answers: [string]) {
        try {
            const quest = await Quest.findOne({ name });
            if (!quest) {
                const newQuest = new Quest
                    ({
                        name,
                        tag,
                        price,
                        description,
                        answers
                    });
                const result = await <IQuest>newQuest.save();
                console.log(`String ${result.name} saved!`);
                return new Result(201, newQuest);
            } else {
                return new Result(400, { message: 'quest exist' });
            }
        } catch (err) {
            console.log(err);
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
            const newQuest = await <IQuest>Quest.findOneAndUpdate(query, update, { new: true });

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
    public async deleteQuest(quest: IQuest) {
        try {
            const query = { '_id': quest.id };
            const deleteQuest = await <IQuest>Quest.findOneAndDelete(query);
            console.log(deleteQuest);
            return new Result(200, deleteQuest);
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }


    // GET questList
    public async getQuestList() {
        const questlist = await Quest.find();
        try {
            const returnList: IQuest[] = [];
                _(questlist).forEach((value: IQuest) => {
                    returnList.push({
                        id: value.id,
                        name: value.name,
                        tag: value.tag,
                        price: value.price,
                        description: value.description
                    });
                });
        return new Result(200, returnList);
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }
    // GET questList on tag

}

export const questController = new QuestController();