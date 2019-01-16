import express from 'express';
import { chineseCollection } from '../utils/mongo';
import { generateResult } from '../utils/utils';

const router = express.Router();

router.get('/all', async (req, res) => {
  const allResult = await chineseCollection().find().toArray();

  res.send(allResult);
});

router.get('/id', async (req, res, next) => {
  const { id } = req.query;

  try {
    const record = await chineseCollection().find({ id }).toArray();

    if (record.length <= 0) {
      return res.status(404).json({
        code: 'get.word.id.not.found',
        message: 'The ID entered cannot be found',
      });
    }

    return res.send(record);
  } catch (e) {
    return next(e);
  }
});

router.get('/lastN', async (req, res, next) => {
  try {
    const {
      numberToFetch,
      showPingYing,
      showCharacter,
      showMeaning,
      showExample,
      showNotes,
    } = req.query;
    const fetchNum = parseInt(numberToFetch, 10);
    const allRecordsCount = await chineseCollection().countDocuments();

    const lastNRecords = await chineseCollection()
      .find({ useForReview: true })
      .sort({ dateAdded: -1 })
      .limit(fetchNum < allRecordsCount ? fetchNum : allRecordsCount)
      .toArray();

    const modifiedResults = generateResult({
      records: lastNRecords,
      showPingYing,
      showMeaning,
      showCharacter,
      showExample,
      showNotes,
    });

    return res.send(modifiedResults);
  } catch (err) {
    return next(err);
  }
});

router.get('/randomN', async (req, res) => {
  const {
    numberToFetch,
    showPingYing,
    showCharacter,
    showMeaning,
    showExample,
    showNotes,
  } = req.query;
  const fetchNum = parseInt(numberToFetch, 10);

  const randomNRecords = await chineseCollection()
    .aggregate([
      { $match: { useForReview: true } },
      { $sample: { size: fetchNum } },
    ])
    .toArray();

  const filteredRecords = randomNRecords.filter(({ useForReview }) => useForReview === true);

  const modifiedResults = generateResult({
    records: filteredRecords,
    showPingYing,
    showMeaning,
    showCharacter,
    showExample,
    showNotes,
  });

  res.send(modifiedResults);
});

export default router;
