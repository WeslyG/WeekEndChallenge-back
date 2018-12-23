import * as express from 'express';
import { userController } from '../../controllers/user-controller';
import { checkToken } from '../../helpers/helpers';

class UserProtectedRoutes {
    public router: express.Router = express.Router();

    constructor() {
        this.config();
    }

    private config(): void {

        // check for all routes. For selective check use it like this:
        // this.router.get('...', checkToken, (req: express.Req...
        this.router.use(checkToken);
        this.router.use(function (err, req, res, next) {
            if (err.name === 'UnauthorizedError') {
                res.status(401).send({ message: '401 unauthorize'});
            }
        });

        this.router.get('/api/user/me', async (req: express.Request, res: express.Response) => {
            const result = await userController.getUserById(req.user.id);
            res.status(result.status).send(result.body);
        });

        this.router.get('/api/user/:id', async (req: express.Request, res: express.Response) => {
            if (!req.params.id) {
                return res.status(401).send('User id is missing.');
            }
            const result = await userController.getUserById(req.params.id);
            res.status(result.status).send(result.body);
        });

        this.router.put('/api/user/update', async (req: express.Request, res: express.Response) => {
            if (!req.body.id || !req.body.name) {
                return res.status(400).send({ message: 'id and name required'});
            } else if (req.body.name.match(/^\W.*/)) {
                return res.status(400).send({ message: 'Name is not valid' });
            } else if (req.user.id !== req.body.id) {
                return res.status(403).send('You are not allowed to change ' + req.body.name + ' profile!');
            }
            const result = await userController.updateUser(req.body);
            res.status(result.status).send(result.body);
        });
    }
}

export const userProtectedRoutes = new UserProtectedRoutes().router;
