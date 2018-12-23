import * as express from 'express';
import { questController } from '../../controllers/quest-controller';

class QuestPublicRoutes {
    public router: express.Router = express.Router();

    constructor() {
        this.config();
    }

    private config(): void {
        // List all
        this.router.get('/api/quest', async (req: express.Request, res: express.Response) => {
            const result = await questController.getQuestList();
            res.status(result.status).send(result.body);
        });
    }
}

export const questPublicRoutes = new QuestPublicRoutes().router;
