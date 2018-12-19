import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

export const QuestSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    tag: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    answers: {
        type: [String],
        required: true
    }
    // links/files
}, { collection: 'quest' });