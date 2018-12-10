import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import { Result } from '../models/result';
import { IQuest } from '../interfaces/quest';
import { QuestSchema } from '../schemas/quest';
import { IQuestResult } from '../interfaces/questResult';

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
    public async newQuest(quest: IQuest) {
        try {
            const exist = await Quest.findOne({ name: quest.name });
            if (!exist) {
                const newQuest = new Quest
                    ({
                        name: quest.name,
                        tag: quest.tag,
                        price: quest.price,
                        description: quest.description,
                        answers: quest.answers
                    });
                const result = await <IQuest>newQuest.save();
                return new Result(201, result);
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
            const returnList: any = [];
            _(questlist).forEach((value: IQuest) => {
                let tag = _.keys(_.pickBy(returnList, { tag: value.tag }))
                if (tag.length === 0) {
                        returnList.push({ 
                            tag: value.tag,
                            quest: []
                        })
                    }
                returnList[_.keys(_.pickBy(returnList, { tag: value.tag }))[0]].quest.push({
                        id: value.id,
                        name: value.name,
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
}

export const questController = new QuestController();