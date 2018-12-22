import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

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
