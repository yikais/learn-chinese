import express from 'express';
import { chineseCollection } from '../utils/mongo';
import { generateResult } from '../utils/utils';

const router = express.Router();

router.get('/all', async (req, res) => {
  const allResult = await chineseCollection().find().toArray();

  res.send(allResult);
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
