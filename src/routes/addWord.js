import express from 'express';
import config from '../../config';
import { mongoCollection } from '../utils/mongo';

const router = express.Router();

router.post('/', (req, res, next) => {
  // const { body } = req;

  mongoCollection(config.mongo.collectionName).save(req.body, (err, result) => {
    if (err) {
      // eslint-disable-next-line no-console
      return console.log(err);
    }

    // eslint-disable-next-line no-console
    console.log('what is result', result);
    return result;
  });

  res.send('New word added successfully');
  next();
});

export default router;
