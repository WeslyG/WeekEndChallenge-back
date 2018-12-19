import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

export const UserQuestSchema = new Schema({
    userId: {
        type: String,
        required: true,
        // unique: true
    },
    questId: {
        type: String,
        required: true,
        // unique: true
    }
}, { collection: 'user-quest' });