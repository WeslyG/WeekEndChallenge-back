import * as mongoose from 'mongoose';
import { QuestSchema } from '../schemas/quest';
import { IQuest } from '../interfaces/quest';
import { Result } from '../models/result';

const Quest = mongoose.model('Quest', QuestSchema);

export class QuestController {

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
                return new Result(201, { message: `Sucess ${result.name} write` });
            } else {
                return new Result(400, { message: 'quest exist' });
            }
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }

    public async updateQuest(quest: IQuest) {
        console.log(quest);
        const questUpdate = quest;
        try {
            const query = { '_id': questUpdate.id };
            const update = {
                name: questUpdate.name,
                description: questUpdate.description,
                tag: questUpdate.tag,
                price: questUpdate.price,
                answers: questUpdate.answers
            };
            const options = { new: true };
            const quest = await <IQuest>Quest.findOneAndUpdate(query, update, options);

            return new Result(200, {
                id: quest.id,
                name: quest.name,
                description: quest.description,
                tag: quest.tag,
                gender: quest.price,
                answers: quest.answers
            });
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }

    // Update Quest

    // Delete Quest


    // GET questList

    // GET quest on tag


}

export const questController = new QuestController();