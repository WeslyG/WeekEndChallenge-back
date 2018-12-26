const apm = require('elastic-apm-node').start({
  serviceName: 'wc-prod',
  serverUrl: 'http://195.201.126.112:8200'
});

import app from './app';
import { configuration } from './configuration/configuration';

const PORT = configuration.port;

app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});
