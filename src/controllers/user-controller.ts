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
                    enabled: true,
                    score: 0,
                    questCount: 0
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
                enabled: user.enabled
            };
            const newUser = await User.findOneAndUpdate(query, update, { new: true });

            return new Result(200, {
                id: newUser.id,
                name: newUser.name,
                login: newUser.login,
                gender: newUser.gender,
                score: newUser.score,
                questCount: newUser.questCount,
                enabled: newUser.enabled
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
                questCount: user.questCount + 1
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
        // TODO:
        try {
            const userList = await User.find({ enabled: true});
            // const returnList: IUser[] = [];

            // _(userList).forEach((value: IUser) => {
            //     returnList.push(value);
            // });
            return new Result(200, userList);
        } catch (err) {
            return new Result(500, err);
        }
    }
}

export const userController = new UserController();
