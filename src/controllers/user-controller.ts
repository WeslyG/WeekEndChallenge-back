import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { Result } from '../models/result';
import { IUser } from '../interfaces/user';
import { UserSchema } from '../schemas/user';
import { createToken } from '../helpers/helpers';
import { userRoleController } from './user-role-controller';
import { configuration } from '../configuration/configuration';
import { IQuest } from '../interfaces/quest';
import { userQuestController } from './user-quest-controller';
import { QuestSchema } from '../schemas/quest';


const Quest = mongoose.model<IQuest>('Quest', QuestSchema);
const User = mongoose.model<IUser>('User', UserSchema);

export class UserController {

    public async login(login: string, password: string) {
        try {
            const user = await User.findOne({ login }); 
            if (!user) {
                return new Result(400, 'Invalid login or password.');
            }
            
            const compareResult = await bcrypt.compare(password, user.passwordHash); 
            
            if (compareResult) {
                const tokenInput = _.pick(user, 'id');

                return new Result(200, {access_token: createToken(tokenInput)});
            } else {
                
                return new Result(400, { message: 'Invalid login or password'});
            }
        } catch (err) {
            return new Result(500, err);
        }
    }

    public async register(name: string, login: string, password: string) {
        try {
            const user = await User.findOne({ login });

            if (!user) {
                const hash = await bcrypt.hash(password, configuration.saltRounds);

                const newUser = new User 
                ({
                    login,
                    name,
                    passwordHash: hash,
                    score: 0
                });

                const result = await newUser.save();
                await userRoleController.addRoleToUser(result.id, configuration.baseRoles.user);
                return new Result(201, result);

            } else {
                return new Result(409, { message: `user ${login} exist`});
            }
        } catch (err) {
            return new Result(500, err);
        }
    }

    public async getUserList() {
        try {
            const userList = await User.find();
            const returnList: IUser[] = [];
            
            _(userList).forEach((value: IUser) => {
                returnList.push(value);
            });
          
            return new Result(200, returnList);
        } catch (err) {
            return new Result(500, err);
        }
    }

    public async getUserById(userId: string) {
        try {
            const user = await User.findById(userId);
            const questsId = await userQuestController.getQuestsByUser(user)
            if (!user) {
                return new Result(400, 'Invallid user.');
            }
            const resolveList = [];

            // Promise.all(questsId.map()).then(res => {
            //     console.log(res);
            // })

            // _(questsId).forEach((value: string) => {
            // for (let len = questsId.length, i = 0; i < len; i++) {                
            //     returnList.push({
            //         test: 'hey you'
            //     })
            // }
            console.log(resolveList);

            return new Result(200, {
                id: user.id,
                name: user.name,
                login: user.login,
                gender: user.gender,
                score: user.score,
                quests: resolveList
            });
        } catch (err) {
            return new Result(500, err);
        }
    }


    public async updateUser(user: IUser, score: number) {
        // FIXME: workaround - score
        try {
            const query = { '_id': user.id };
            const update = { name: user.name, gender: user.gender, score};
            const newUser = await User.findOneAndUpdate(query, update, { new: true });
            
            return new Result(200, {
                id: newUser.id,
                name: newUser.name,
                login: newUser.login,
                gender: newUser.gender,
                score: newUser.score
            });
        } catch (err) {
            return new Result(500, err);
        }
    }

    public async addScoreForQuest(user: IUser, quest: IQuest) {
        try {
            const score = user.score + quest.price
            const result = await this.updateUser(user, score);
            return result;
        } catch (err) {
            return new Result(500, err);
        }
    }


    public async createBasicUsers() {
        try {
            const user = await User.findOne({ login: configuration.baseUsers.admin.login });

            if (!user) {
                const password = configuration.baseUsers.admin.defaultPassword;
            
                const hash = await bcrypt.hash(password, configuration.saltRounds);

                const newUser = new User 
                ({
                    login: configuration.baseUsers.admin.login,
                    name: configuration.baseUsers.admin.name,
                    passwordHash: hash
                });
                
                const result = await newUser.save();
                
                await userRoleController.addRoleToUser(result.id, configuration.baseRoles.admin);
                await userRoleController.addRoleToUser(result.id, configuration.baseRoles.user);
            }
            // user already exist
        } catch (err) {
            return new Result(500, err);
        }
    }
}

export const userController = new UserController();