import * as jwt from 'jsonwebtoken';
import * as jwt_express from 'express-jwt';
import { configuration } from '../configuration/configuration';

export const createToken = (payload: string | Object | Buffer) => {
    return jwt.sign(payload, configuration.secret, 
    { 
        // in case of session expiration
    // expiresIn: 60*60 
    });
}

export const checkToken = jwt_express({secret: configuration.secret});