import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { UserRoleSchema } from '../schemas/user-role';
import { roleController } from './role-controller';

const UserRole = mongoose.model('UserRole', UserRoleSchema);

export class UserRoleController {

    public async addRoleToUser(userId: string, roleName: string) {
        try {
            const role = await roleController.getRoleByName(roleName);

            if (role) {
                const userRole = await UserRole.findOne({ userId: userId, roleId: role.id });
                if (!userRole) {
                    const newUserRole = new UserRole ({
                        userId: userId,
                        roleId: role.id
                    });
                    await newUserRole.save();
                    console.log('Role was added to user: ' + userId);
                } else {
                    console.log('User role exists');
                }
            } else {
                console.log('No such role');
            }
        } catch (err) {
            console.log(err);
        }
    }

    public async deleteRoleFromUser(userId: string, roleName: string) {
        try {
            const role = await roleController.getRoleByName(roleName);
            if (role) {
                await UserRole.findOneAndDelete({ userId: userId, roleId: role.id })
                console.log('Role was deleted from user: ' + userId);
            } else {
                console.log('No such role');
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export const userRoleController = new UserRoleController();
