import express from 'express';
import moment from 'moment';
import { chineseCollection } from '../utils/mongo';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const data = req.body;

    const newIds = data.map(({ id }) => id);
    const existingIds = await chineseCollection().find({ id: { $in: newIds } }).toArray();

    if (existingIds.length > 0) {
      return res.status(500).json({
        code: 'add.word.duplicate.entry',
        message: 'An ID already exists in mongo',
      });
    }

    const dateAdded = moment().format();

    const updatedData = data.map(datum => ({
      ...datum,
      dateAdded,
      dateModified: dateAdded,
      timesTested: 0,
      timesCorrect: 0,
      timesIncorrect: 0,
      useForReview: true,
    }));

    try {
      await chineseCollection().insertMany(updatedData);
    } catch ({ message }) {
      return res.status(500).json({
        code: 'add.word.mongo.fail',
        message,
      });
    }

    return res.send({
      code: 'add.word.success',
      message: `IDs ${updatedData.map(({ id }) => id).join(', ')}, and words ${updatedData.map(({ character }) => character).join(', ')} added successfully`,
    });
  } catch (e) {
    return next(e);
  }
});

export default router;
