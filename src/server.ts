import app from './app';
import { configuration } from './configuration/configuration';

const PORT = configuration.port;

app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});
