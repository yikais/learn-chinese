import express from 'express';
import { chineseCollection } from '../utils/mongo';
import { generateResult } from '../utils/utils';

const router = express.Router();

router.get('/all', async (req, res) => {
  const allResult = await chineseCollection().find().toArray();

  res.send(allResult);
});

router.get('/lastN', async (req, res) => {
  const {
    numberToFetch,
    showPingYing,
    showCharacter,
    showTraditionalCharacter,
    showMeaning,
    showExample,
    showNotes,
  } = req.query;
  const fetchNum = parseInt(numberToFetch, 10);
  const allRecordsCount = await chineseCollection().countDocuments();

  const lastNRecords = await chineseCollection()
    .find()
    .sort({ dateAdded: -1 })
    .limit(fetchNum < allRecordsCount ? fetchNum : allRecordsCount)
    .toArray();

  const modifiedResults = generateResult({
    records: lastNRecords,
    showPingYing,
    showMeaning,
    showCharacter,
    showTraditionalCharacter,
    showExample,
    showNotes,
  });

  res.send(modifiedResults);
});

router.get('/randomN', async (req, res) => {
  const {
    numberToFetch,
    showPingYing,
    showCharacter,
    showTraditionalCharacter,
    showMeaning,
    showExample,
    showNotes,
  } = req.query;
  const fetchNum = parseInt(numberToFetch, 10);

  const randomNRecords = await chineseCollection()
    .aggregate([{ $sample: { size: fetchNum } }])
    .toArray();

  const modifiedResults = generateResult({
    records: randomNRecords,
    showPingYing,
    showMeaning,
    showCharacter,
    showTraditionalCharacter,
    showExample,
    showNotes,
  });

  res.send(modifiedResults);
});

export default router;
