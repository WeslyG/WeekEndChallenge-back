import * as express from 'express';
import * as bodyParser from 'body-parser';
import mongoose = require('mongoose');
import cors = require('cors');
import { configuration } from './configuration/configuration';
import { userController } from './controllers/user-controller';
import { roleController } from './controllers/role-controller';

import { userPublicRoutes } from './routes/public/user-routes';
import { questPublicRoutes } from './routes/public/quest-routes';

import { userProtectedRoutes } from './routes/protected/user-routes';
import { questProtectRoutes } from './routes/protected/quest-routes';
import { roleProtectedRoutes } from './routes/protected/role-routes';


class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config() {
    this.setDatabase();
    this.setParsers(true);
    this.setCors();
    this.setRouting();
  }

  private async setDatabase() {
    try {
      mongoose.set('useCreateIndex', true);

      await mongoose.connect(configuration.dataBase.host + configuration.dataBase.name, { useNewUrlParser: true })
      console.log('MongoDB has started...')

      this.dbSeed();
    } catch (err) {
      console.log(err);
    }
  }

  private async dbSeed() {
    await roleController.createBasicRoles();
    await userController.createBasicUsers();
  }

  private setParsers(useNestedObjects: boolean) {
    // support application/json
    this.app.use(bodyParser.json());
    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: useNestedObjects }));
  }

  private setRouting() {
    this.app.use(userPublicRoutes);
    this.app.use(questPublicRoutes);

    this.app.use(userProtectedRoutes);
    this.app.use(roleProtectedRoutes);
    this.app.use(questProtectRoutes);
  }

  private setCors() {
    this.app.use(cors({origin:function(origin, callback){
        callback(null, true);
        }, credentials: true})
    );
  }
}

export default new App().app;