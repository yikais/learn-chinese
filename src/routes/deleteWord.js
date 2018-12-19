import express from 'express';
import { chineseCollection } from '../utils/mongo';

const router = express.Router();

function setSearchTerm(query) {
  const { id, character } = query;

  if (id) return { searchTerm: 'id', searchQuery: id };
  if (character && !id) return { searchTerm: 'character', searchQuery: character };
  return { searchTerm: '', searchQuery: '' };
}

router.post('/removeFromReview', async (req, res, next) => {
  try {
    const { searchTerm, searchQuery } = setSearchTerm(req.query);
    const query = {};
    query[searchTerm] = searchQuery;

    const result = await chineseCollection()
      .updateOne(query, {
        $set: { useForReview: false },
      });

    return res.send(result);
  } catch (err) {
    return next(err);
  }
});

export default router;
