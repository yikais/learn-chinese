import express from 'express';
import bodyParser from 'body-parser';
import config from '../config';
import explorerRoute from './routes/explorer';
import addWordRoute from './routes/addWord';
import getWordRoute from './routes/getWord';
import { connect } from './utils/mongo';

const mongoUrl = config.mongo.url;
const server = express();

function start() {
  return new Promise(async (resolve) => {
    try {
      await connect(mongoUrl);

      server.listen(config.port, () => {
        // eslint-disable-next-line no-console
        console.info(`Server started on ${config.port}`);
        resolve();
      });
    } catch (err) {
      process.exit(1);
    }
  });
}

server.use(bodyParser.json());

start();

if (config.allowExplorer) {
  server.use(explorerRoute);
}

server.use('/addWord', addWordRoute);

server.use('/getWord', getWordRoute);
