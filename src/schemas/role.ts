import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

export const RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, { collection: 'roles' });