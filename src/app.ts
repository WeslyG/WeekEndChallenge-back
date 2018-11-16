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

    // initialize database
    mongoose.connect('mongodb://localhost/' + configuration.dataBaseName, { useNewUrlParser: true })
      .then(() => console.log('MongoDB has started...'))
      .catch(e => console.log(e));
    mongoose.set('useCreateIndex', true);

    // Parsers

    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // support application/json
    this.app.use(bodyParser.json());

    this.app.use(cors({origin:function(origin, callback){
        callback(null, true);
        }, credentials:true})
    );

    this.app.use(function(err, req, res, next) {
      if (err.name === 'StatusError') {
        res.send(err.status, err.message);
      } else {
        next(err);
      }
    });

    // support application/json
    this.app.use(bodyParser.json());
    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));


    // routing
    this.app.use(userPublicRoutes);
    this.app.use(userProtectedRoutes);
  }
}

export default new App().app;