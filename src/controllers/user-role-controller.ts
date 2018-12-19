import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { UserRoleSchema } from '../schemas/user-role';
import { roleController } from './role-controller';
import { configuration } from '../configuration/configuration';
import { RoleSchema } from '../schemas/role';
import { IRole } from '../interfaces/role';
import { IUserRole } from '../interfaces/user-role';
import { Result } from '../models/result';
import { IUser } from '../interfaces/user';

const UserRole = mongoose.model<IUser>('UserRole', UserRoleSchema);
const Role = mongoose.model<IRole>('Role', RoleSchema);

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
                    return new Result(200, 'Role was added to user: ' + userId);
                } else {
                    return new Result(400, 'User role exists');
                }
            } else {
                return new Result(400, 'No such role');
            }
        } catch (err) {
            return new Result(500, err);
        }
    }

    public async deleteRoleFromUser(userId: string, roleName: string) {
        try {
            const role = await roleController.getRoleByName(roleName);
            if (role) {
                await UserRole.findOneAndDelete({ userId: userId, roleId: role.id });
                return new Result(200, 'Role was deleted from user: ' + userId);
            } else {
                return new Result(400, 'No such role');
            }
        } catch (err) {
            return new Result(500, err);
        }
    }

    public async getUserRoles(userId: string) {
        try {
            const roles = await Role.find();
            const userRoles = await UserRole.find({ userId });

            const returnList: IRole[] = [];

            _(userRoles).forEach((value: IUserRole) => {
                const role = <IRole>roles.find((i: IRole) => i.id === value.roleId);
                if (role) {
                    returnList.push(role);
                }
            });
            return new Result(200, returnList);
        } catch (err) {
            return new Result(500, err);
        }
    }

    public async isAdminCheck(userId: string) {
        try {
            const adminRole = await Role.findOne({ name: configuration.baseRoles.admin });
            const userAdminRole = await UserRole.findOne({ userId, roleId: adminRole.id });
            if (userAdminRole) {
                return new Result(200, true);;
            } else {
                return new Result(200, false);;
            }
        } catch (err) {
            return new Result(500, err);
        }
    }
}

export const userRoleController = new UserRoleController();
