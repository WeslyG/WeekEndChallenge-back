import * as express from 'express';
import * as bodyParser from 'body-parser';
import mongoose = require('mongoose');
import cors = require('cors');
import { userPublicRoutes } from './routes/public/user-routes';
import { configuration } from './configuration/configuration';
import { userProtectedRoutes } from './routes/protected/user-routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.setDatabase();
    this.setParsers(true);
    this.setCors();
    this.setRouting();
  }

  private setDatabase(): void {
    mongoose.connect('mongodb://localhost/' + configuration.dataBaseName, { useNewUrlParser: true })
      .then(() => console.log('MongoDB has started...'))
      .catch(e => console.log(e));
    
    mongoose.set('useCreateIndex', true);
  }

  private setParsers(useNestedObjects: boolean): void {
    // support application/json
    this.app.use(bodyParser.json());
    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: useNestedObjects }));
  }

  private setRouting(): void {
    this.app.use(userPublicRoutes);
    this.app.use(userProtectedRoutes);
  }

  private setCors(): void {
    this.app.use(cors({origin:function(origin, callback){
        callback(null, true);
        }, credentials: true})
    );
  }
}

export default new App().app;