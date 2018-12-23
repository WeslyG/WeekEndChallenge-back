import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const UserRoleSchema = new Schema({
    userId: {
        type: String,
        required: true,
        // unique: true
    },
    roleId: {
        type: String,
        required: true,
        // unique: true
    }
}, { collection: 'user-roles', timestamps: true });
