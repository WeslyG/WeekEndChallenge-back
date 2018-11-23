import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { configuration } from '../configuration/configuration';
import { RoleSchema } from '../schemas/role';
import { IRole } from '../interfaces/role';

const Role = mongoose.model('Role', RoleSchema);

export class RoleController {

    public async createBasicRoles() {
        try {
            let adminRole = await Role.findOne({ name: configuration.baseRoles.admin });
        
            if (!adminRole) {
                adminRole = new Role 
                ({
                    name: configuration.baseRoles.admin
                });
                
                const result = await <IRole>adminRole.save();
                console.log('Role ' + result.name + ' saved');
            }

            let userRole = await Role.findOne({ name: configuration.baseRoles.user });
        
            if (!userRole) {
                userRole = new Role 
                ({
                    name: configuration.baseRoles.user
                });
                
                const result = await <IRole>userRole.save();
                console.log('Role ' + result.name + ' saved');
            }

        } catch (err) {
            console.log(err);
        }
    }

    public async getRoleByName(roleName: string) {
        try {
            const role = Role.findOne({ name: roleName });
            return role;
        } catch (err) {
            console.log(err);
        }
    }
}

export const roleController = new RoleController();
