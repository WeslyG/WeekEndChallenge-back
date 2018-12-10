import * as express from 'express';
import { checkToken } from '../../helpers/helpers';
import { questController } from '../../controllers/quest-controller';

class QuestProtectRoutes {
    public router: express.Router = express.Router();

    constructor() {
        this.config();
    }

    private config(): void {
        this.router.use(checkToken);
        this.router.use(function (err, req, res, next) {
            if (err.name === 'UnauthorizedError') {
                res.status(401).send({ message: '401 unauthorize' });
            }
        });

        // Create
        this.router.post('/api/quest', async (req: express.Request, res: express.Response) => {
            const result = await questController.newQuest(req.body);
            res.status(result.status).send(result.body);
        });
        
        // Find one
        this.router.get('/api/quest/:id', async (req: express.Request, res: express.Response) => {
            const result = await questController.getQuest(req.params.id);
            res.status(result.status).send(result.body);
        });

        // Update
        this.router.put('/api/quest', async (req: express.Request, res: express.Response) => {
            // add roles admin only
            if (!req.body.id) {
                return res.status(400).send({ message: 'id is required' });
            }
            const result = await questController.updateQuest(req.body);
            res.status(result.status).send(result.body);
        });

        // Delete
        // TODO: deleted: true
        this.router.delete('/api/quest', async (req: express.Request, res: express.Response) => {
            if (!req.body.id) {
                return res.status(400).send({ message: 'id is required' });
            }
            const result = await questController.deleteQuest(req.body);
            res.status(result.status).send(result.body);
        });

        // Answer
        this.router.post('/api/quest/answer', async (req: express.Request, res: express.Response) => {
            if (!req.body) {
                return res.status(400).send({ message: 'no quest to update' });
            }
            const result = await questController.updateQuest(req.body);
            res.status(result.status).send(result.body);
        });
    }
}

export const questProtectRoutes = new QuestProtectRoutes().router;