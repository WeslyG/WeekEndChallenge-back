import * as express from 'express';
import { userController } from '../../controllers/user-controller';

class UserPublicRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    
    this.router.post('/api/login', async (req: express.Request, res: express.Response) => {
      if (!req.body.email || !req.body.password) {
        return res.status(400).send('You must send email and password');
      }
      const result = await userController.login(req.body.email, req.body.password);
      res.status(result.status).send(result.body);
    });

    this.router.post('/api/register', async (req: express.Request, res: express.Response) => {
      if (!req.body.name) {
        return res.status(400).send('You must send name');
      }
      if (!req.body.email) {
        return res.status(400).send('You must send email');
      }
      if (!req.body.password) {
        return res.status(400).send('You must send password');
      }
      const result = await userController.register(req.body.name, req.body.email, req.body.password);
      res.status(result.status).send(result.body);
    });
  }
}

export const userPublicRoutes = new UserPublicRoutes().router;