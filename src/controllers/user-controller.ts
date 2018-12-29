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
import { IScoreBoard } from '../interfaces/scoreBoard';
import { IUserQuest } from '../interfaces/user-quest';
import { UserQuestSchema } from '../schemas/user-quest';

const User = mongoose.model<IUser>('User', UserSchema);
const UserQuest = mongoose.model<IUserQuest>('UserQuest', UserQuestSchema);

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

                return new Result(200, { access_token: createToken(tokenInput), id: user.id});
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
                    enabled: true,
                    score: 0,
                    questCount: 0,
                    lastUpdate: new Date()
                });
                const result = await newUser.save();
                await userRoleController.addRoleToUser(result.id, configuration.baseRoles.user);
                return new Result(201, {
                    id: newUser.id,
                    login: newUser.login,
                    name: newUser.name,
                    score: newUser.score,
                    questCount: newUser.questCount
                });
            } else {
                return new Result(409, { message: `user ${login} exist`});
            }
        } catch (err) {
            return new Result(500, err);
        }
    }

    public async getUserById(userId: string) {
        try {
            const user = await User.findById(userId);
            const userQuests = await userQuestController.getQuestsByUser(user);
            if (!user) {
                return new Result(400, 'Invallid user.');
            }
            return new Result(200, {
                id: user.id,
                name: user.name,
                login: user.login,
                gender: user.gender,
                score: user.score,
                questCount: user.questCount,
                quests: userQuests,
            });
        } catch (err) {
            return new Result(500, err);
        }
    }


    public async updateUser(user) {
        // че за бред, надо вытащить нормального юзера авторизированного да и все
        try {
            const query = { '_id': user.id };
            const update = {
                name: user.name,
                gender: user.gender,
                score: user.score,
                questCount: user.questCount,
                enabled: user.enabled,
                lastUpdate: user.lastUpdate
            };
            const newUser = await User.findOneAndUpdate(query, update, { new: true });

            return new Result(200, {
                id: newUser.id,
                name: newUser.name,
                login: newUser.login,
                gender: newUser.gender,
                score: newUser.score,
                questCount: newUser.questCount,
                enabled: newUser.enabled,
                lastUpdate: newUser.lastUpdate
            });
        } catch (err) {
            return new Result(500, err);
        }
    }

    public async addScoreForQuest(user: IUser, quest: IQuest) {
        try {
            const newUser = {
                id: user.id,
                name: user.name,
                login: user.login,
                gender: user.gender,
                score: user.score + quest.price,
                enabled: user.enabled,
                questCount: user.questCount + 1,
                lastUpdate: new Date()
            };

            const result = await this.updateUser(newUser);
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

    public async getUserList() {
        try {
            const userList = await User.find(
                { enabled: true },
                ['name', 'score', 'questCount', 'lastUpdate'],
                {
                    sort: {
                        score: -1,
                        lastUpdate: 1
                    }
                }
            );

            const returnList: IScoreBoard[] = [];
            let i = 1;
            _(userList).forEach(value => {
                returnList.push({
                    id: value.id,
                    position: i++,
                    name: value.name,
                    score: value.score,
                    questCount: value.questCount,
                    lastUpdate: value.lastUpdate
                });
            });

            return new Result(200, returnList);
        } catch (err) {
            return new Result(500, err);
        }
    }
}

export const userController = new UserController();
