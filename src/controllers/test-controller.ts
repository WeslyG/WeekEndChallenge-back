import * as mongoose from 'mongoose';
import { TestSchema } from '../schemas/test';
import { ITest } from '../interfaces/test';
import { Result } from '../models/result';

const Test = mongoose.model('Test', TestSchema);

export class TestController {
    
    public async test(mystring: string) {
        try {
            const text = await Test.findOne({ template: mystring });
            console.log(text);
            
            if(!text) {
                const newMessage = new Test
                    ({
                        template: mystring
                    });
                const result = await <ITest>newMessage.save();
                console.log(result);
                // console.log(`String ${result.template} saved!`);
                return new Result(201, { message: `Sucess ${result.template} write` });
            } else {
                return new Result(400, { message: `Template exist` });
            }
        } catch(err) {
            console.log(err);
            return new Result(500, err);
        }
    }
}

export const testController = new TestController();  