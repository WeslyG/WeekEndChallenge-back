import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { UserSchema } from '../schemas/user';
import { createToken } from '../helpers/helpers';
import { IUser } from '../interfaces/user';
import { Result } from '../models/result';
import { configuration } from '../configuration/configuration';
import { userRoleController } from './user-role-controller';

const User = mongoose.model('User', UserSchema);

export class UserController {

    public async login(login: string, password: string) {
        try {
            const user = await <IUser>User.findOne({ login }); 

            if (!user) {
                return new Result(400, 'Invalid login or password.');
            }
            
            const compareResult = await bcrypt.compare(password, user.passwordHash); 
            
            if (compareResult) {
                const tokenInput = _.pick(user, 'login', 'name', 'id');

                return new Result(201, {id_token: createToken(tokenInput)});
            } else {
                
                return new Result(400, 'Invalid login or password.');
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
                    passwordHash: hash
                });

                const result = await <IUser>newUser.save();
                console.log('User ' + result.name + ' saved!');
                
                await userRoleController.addRoleToUser(result.id, configuration.baseRoles.user);

                const tokenInput = _.pick(result, 'login', 'name', 'id');

                return new Result(201, { id_token: createToken(tokenInput) });

            } else {
                return new Result(400, 'User exist.');
            }
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }

    public async getUserList() {
        try {
            const userList = await User.find(); 
            const returnList: IUser[] = [];
            
            _(userList).forEach((value: IUser) => {
                returnList.push({
                    id: value.id,
                    name: value.name,
                    login: value.login,
                    gender: value.gender
                });
            });
          
            return new Result(200, returnList);
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }

    public async getUserById(userId: string) {
        try {
            const user = await <IUser>User.findById(userId);

            if (!user) {
                return new Result(400, 'Invallid user.');
            }
            
            return new Result(200, {
                id: user.id,
                name: user.name,
                login: user.login,
                gender: user.gender
            });
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }

    public async updateUser(user: IUser) {
        console.log(user);
        const userToUpdate = user;
        try {
            const query = { '_id': userToUpdate.id };
            const update = { name: userToUpdate.name, gender: userToUpdate.gender };
            const options = { new: true };  

            const user = await <IUser>User.findOneAndUpdate(query, update, options);
            
            return new Result(200, {
                id: user.id,
                name: user.name,
                login: user.login,
                gender: user.gender
            });
        } catch (err) {
            console.log(err);
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
                
                const result = await <IUser>newUser.save();
                console.log('User ' + result.name + ' saved');
                
                await userRoleController.addRoleToUser(result.id, configuration.baseRoles.admin);
                await userRoleController.addRoleToUser(result.id, configuration.baseRoles.user);
            }
        } catch (err) {
            console.log(err);
            return new Result(500, err);
        }
    }
}

export const userController = new UserController();
