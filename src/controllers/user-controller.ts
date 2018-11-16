import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { UserSchema } from '../schemas/user';
import { createToken } from '../helpers/helpers';
import { IUser } from '../interfaces/user';
import { configuration } from '../configuration/configuration';

const User = mongoose.model('User', UserSchema);

export class UserController {

    public login(req: Request, res: Response) {
        User.findOne({ email: req.body.email }, (err: Error, user: IUser) => {
            if (err) return res.status(500).send(err);
        
            if (!user) {
                return res.status(400).send("A user with that email doesn't exists");
            }

            const password = req.body.password;
        
            bcrypt.compare(password, user.passwordHash, (err, result) => {
                if (err) {    
                    return res.status(400).send(err.message);
                }    
            
                const tokenInput = _.pick(user, 'email', 'name', 'id');
            
                if (result) {
                    return res.status(201).send({
                        id_token: createToken(tokenInput)
                    });
                } else {
                    return res.status(401).send("Invalid email or password.");
                }
            });
        });
    }

    public register(req: Request, res: Response) {
        User.findOne({ email: req.body.email }, (err: Error, user: IUser) => {
            if (err) return res.status(500).send(err);
        
            if(!user) {
                
                const password = req.body.password;
            
                bcrypt.hash(password, configuration.saltRounds, (err, hash) => {
                    
                    const newUser = new User 
                    ({
                        email: req.body.email,
                        name: req.body.name,
                        passwordHash: hash
                    });
                    
                    newUser.save((err: Error, user: IUser) => {
                        if (err) return console.error(err);

                        console.log("User " + user.name + " saved");
                
                        const tokenInput = _.pick(user, 'email', 'name', 'id');
                
                        return res.status(201).send({
                            id_token: createToken(tokenInput)
                        });
                    });
                });
            } else {
                return res.status(400).send("User exist");
            }
        });
    }

    public getLoggedUser(req: Request, res: Response) {
        User.findById(req.user.id, (err: Error, user: IUser) => {
            if (err) return res.status(500).send(err);
        
            if (!user) {
                return res.status(400).send("Invallid user.");
            }
        
            res.status(200).send({
                id: user.id,
                name: user.name,
                email: user.email,
                birthDay: user.birthDay,
                gender: user.gender
            });
        });
    }

    public getUserList(req: Request, res: Response) {
        User.find((err: Error, userList: IUser[]) => {
            if (err) return res.status(500).send(err);
        
            var returnList: IUser[] = [];
            // var userList = _.remove(userList, u => u.id != req.user.id);
            _(userList).forEach((value: IUser) => {
                returnList.push({
                    id: value.id,
                    name: value.name,
                    email: value.email,
                    birthDay: value.birthDay,
                    gender: value.gender
                });
            });
          
            res.status(200).send(returnList);
        });
    }

    public getUserById(req: Request, res: Response) {
        User.findById(req.params.id, (err: Error, user: IUser) => {
            if (err) return res.status(500).send(err);
        
            if (!user) {
              return res.status(400).send("Invallid user.");
            }
        
            res.status(200).send({
                id: user.id,
                name: user.name,
                email: user.email,
                birthDay: user.birthDay,
                gender: user.gender
            });
        });
    }

    public updateUser(req: Request, res: Response) {
        const query = { "_id": req.body.id };
        const update = { name: req.body.name, gender: req.body.gender, birthDay: req.body.birthDay };
        const options = { new: true };  

        User.findOneAndUpdate(query, update, options, (err: Error, user: IUser) => {
            if (err) return res.status(500).send(err);
            
            res.status(200).send({
                id: user.id,
                name: user.name,
                email: user.email,
                birthDay: user.birthDay,
                gender: user.gender
            });
        });
    }
}

export const userController = new UserController();
