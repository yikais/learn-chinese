import express from 'express';
import { chineseCollection } from '../utils/mongo';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { id, isCorrect } = req.body;
    const [foundWord] = await chineseCollection().find({ id }).toArray();

    if (!foundWord || foundWord.length > 1) {
      return res.status(500).json({
        code: 'submit.test.result.id.not.valid',
        message: 'ID entered is not valid',
      });
    }

    try {
      await chineseCollection()
        .updateOne({ id }, {
          $set: {
            timesTested: foundWord.timesTested + 1,
            timesCorrect: isCorrect ? foundWord.timesCorrect + 1 : foundWord.timesCorrect,
            timesIncorrect: isCorrect ? foundWord.timesIncorrect : foundWord.timesIncorrect + 1,
          },
        });
    } catch ({ message }) {
      return res.status(500).json({
        code: 'submit.test.result.mongo.fail',
        message,
      });
    }

    return res.send({
      code: 'submit.test.result.success',
      message: `ID ${id} submitted successfully, isCorrect is ${isCorrect}`,
    });
  } catch (e) {
    return next(e);
  }
});

export default router;
