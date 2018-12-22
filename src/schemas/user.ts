import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    score: {
        type: Number,
        required: false
    },
    questCount: {
        type: Number,
        required: false
    },
    gender: {
        type: Number,
        required: false
    },
    passwordHash: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: false
    }
}, { collection: 'users' });
