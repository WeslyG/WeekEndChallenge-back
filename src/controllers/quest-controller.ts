import * as mongoose from 'mongoose';
import { QuestSchema } from '../schemas/quest';
import { IQuest } from '../interfaces/quest';
import { Result } from '../models/result';

const Quest = mongoose.model('Test', QuestSchema);

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
                console.log(result);
                // console.log(`String ${result.template} saved!`);
                return new Result(201, { message: `Sucess ${result.name} write` });
            } else {
                return new Result(400, { message: 'quest exist' });
            }
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }
}

export const questController = new QuestController();