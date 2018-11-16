import * as express from "express";
import { userController } from "../../controllers/user-controller";

class UserPublicRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    // login
    this.router.post('/api/login', (req: express.Request, res: express.Response) => {
      if (!req.body.email || !req.body.password) {
        return res.status(400).send("You must send email and password");
      }
      userController.login(req, res);
    });

    // register
    this.router.post('/api/register', (req: express.Request, res: express.Response) => {
      if (!req.body.name) {
        return res.status(400).send("You must send name");
      }
      if (!req.body.email) {
        return res.status(400).send("You must send email");
      }
      if (!req.body.password) {
        return res.status(400).send("You must send password");
      }
      userController.register(req, res);
    });
  }
}

export const userPublicRoutes = new UserPublicRoutes().router;