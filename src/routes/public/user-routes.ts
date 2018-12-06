import * as express from 'express';
import { userController } from '../../controllers/user-controller';
import { testController } from '../../controllers/test-controller';
import { questController } from '../../controllers/quest-controller';

class UserPublicRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    
    // this.router.get('/api/check', async (req: express.Request, res: express.Response) => {
    //   const result = await questController.newQuest(req.body.name, req.body.tag, req.body.description, req.body.price, req.body.answers);
    //   res.status(result.status).send(result.body);
      // For mock
      // const result = await testController.test(req.body.name);
      // return res.status(200).send({ message: result });
    // });

    this.router.post('/api/login', async (req: express.Request, res: express.Response) => {
      if (!req.body.login || !req.body.password) {
        return res.status(400).send('You must send login and password');
      }
      const result = await userController.login(req.body.login, req.body.password);
      res.status(result.status).send(result.body);
    });

    this.router.post('/api/register', async (req: express.Request, res: express.Response) => {
      if (!req.body.name) {
        return res.status(400).send('You must send name');
      }
      if (!req.body.login) {
        return res.status(400).send('You must send login');
      }
      if (!req.body.password) {
        return res.status(400).send('You must send password');
      }
      const result = await userController.register(req.body.name, req.body.login, req.body.password);
      res.status(result.status).send(result.body);
    });
  }
}

export const userPublicRoutes = new UserPublicRoutes().router;
