import express from 'express';
import { chineseCollection } from '../utils/mongo';

const router = express.Router();

router.get('/', (req, res) => {
  chineseCollection().find().toArray((err, results) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('error encountered', err);
    }

    res.send(results);
  });
});

export default router;
