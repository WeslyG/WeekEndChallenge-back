import * as express from 'express';
import { checkToken } from '../../helpers/helpers';
import { userRoleController } from '../../controllers/user-role-controller';

class RoleProtectedRoutes {
    public router: express.Router = express.Router();

    constructor() {
        this.config();
    }

    private config(): void {

        // check for all routes. For selective check use it like this:
        // this.router.get('...', checkToken, (req: express.Req...
        
        this.router.use(checkToken); 

        this.router.get('/api/role/isAdmin', async (req: express.Request, res: express.Response) => {
            if (!req.user) {
                return res.status(401).send('Invallid user.');
            }
            const result = await userRoleController.isAdminCheck(req.user.id);
            res.status(result.status).send(result.body);
        });
        
    }
}

export const roleProtectedRoutes = new RoleProtectedRoutes().router;