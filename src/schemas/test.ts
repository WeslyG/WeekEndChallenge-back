import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

export const TestSchema = new Schema({
    template: {
        type: String,
        required: true,
        unique: true
    }
}, { collection: 'test' });