import { Document } from "mongoose";

export interface IUserRole extends Document {
    id?: string;
    userId?: string,
    roleId?: string
}