import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

export const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: Number,
        required: false
    },
    birthDay: {
        type: Date,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    }
}, { collection: 'users' });