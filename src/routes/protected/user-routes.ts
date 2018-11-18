import * as express from "express";
import { userController } from "../../controllers/user-controller";
import { checkToken } from "../../helpers/helpers";

class UserProtectedRoutes {
    public router: express.Router = express.Router();

    constructor() {
        this.config();
    }

    private config(): void {

        // check for all routes. For selective check use it like this:
        // this.router.get('...', checkToken, (req: express.Req...
        
        this.router.use(checkToken); 
        
        this.router.get('/api/user/me', (req: express.Request, res: express.Response) => {
            if (!req.user) {
                return res.status(401).send("Invallid user.");
            }
            userController.getLoggedUser(req, res);
        });

        this.router.get('/api/user/user/:id', (req: express.Request, res: express.Response) => {
            if (!req.user) {
              return res.status(401).send("Invallid user.");
            }
            userController.getUserById(req, res);
        });
        
        this.router.get('/api/user/list', (req: express.Request, res: express.Response) => {
            if (!req.user) {
              return res.status(401).send("Invallid user.");
            }
            userController.getUserList(req, res);
        });

        this.router.post('/api/user/update', (req: express.Request, res: express.Response) => {
            userController.updateUser(req, res);
        });
    }
}

export const userProtectedRoutes = new UserProtectedRoutes().router;