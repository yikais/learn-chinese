import express from 'express';
import moment from 'moment';
import axios from 'axios';
import config from '../../config';
import { chineseCollection } from '../utils/mongo';
import { parseDictionaryResults } from '../utils/utils';

const router = express.Router();

router.post('/detailed', async (req, res, next) => {
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

router.post('/simple', async (req, res, next) => {
  try {
    const { id, character, notes } = req.body;

    const existingIds = await chineseCollection().find({ id }).toArray();

    if (existingIds.length > 0) {
      return res.status(500).json({
        code: 'add.word.duplicate.entry',
        message: 'An ID already exists in mongo',
      });
    }

    const encodedChar = encodeURI(character);
    const { dictionaryHost } = config;
    const querySt = '010';
    const queryRlt = '000';
    const queryEnc = 'UTF-8';
    const queryRFormat = 'json';
    const queryREnc = 'UTF-8';

    const queryUrl = `${dictionaryHost}?q=${encodedChar}&st=${querySt}&r_lt=${queryRlt}&q_enc=${queryEnc}&r_format=${queryRFormat}&r_enc=${queryREnc}`;

    try {
      const response = await axios.get(queryUrl);
      const results = response.data.items[1];

      const parsedData = parseDictionaryResults(results);

      const dateAdded = moment().format();

      const updatedData = {
        id,
        ...parsedData,
        notes,
        dateAdded,
        dateModified: dateAdded,
        timesTested: 0,
        timesCorrect: 0,
        timesIncorrect: 0,
        useForReview: true,
      };

      try {
        await chineseCollection().insertOne(updatedData);
      } catch ({ message }) {
        return res.status(500).json({
          code: 'add.word.mongo.fail',
          message,
        });
      }

      return res.send({
        code: 'add.word.search.success',
        message: `ID: ${id} | Word: ${character} successfully added`,
      });
    } catch ({ message }) {
      return res.status(500).json({
        code: 'search.dictionary.fail',
        message,
      });
    }
  } catch (e) {
    return next(e);
  }
});

export default router;
