import express from 'express';
import { mongoCollection } from '../utils/mongo';
import config from '../../config';

const router = express.Router();

router.get('/', (req, res) => {
  mongoCollection(config.mongo.collectionName).find().toArray((err, results) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('error encountered', err);
    }

    res.send(results);
  });
});

export default router;
