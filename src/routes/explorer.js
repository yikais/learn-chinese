import express from 'express';
import yamljs from 'yamljs';
import fs from 'fs';

const router = express.Router();
const cwd = process.cwd();

router.get('/explorer', (req, res, next) => {
  if (req.query.url) {
    next();
  } else {
    res.redirect('/explorer?url=api');
  }
});

router.use('/explorer', express.static(`${cwd}/node_modules/swagger-ui-dist/`));

router.get('/explorer/api', (req, res) => {
  fs.readFile(`${cwd}/api.yaml`, (err, result) => {
    const yaml = result.toString();
    const json = yamljs.parse(yaml);
    res.json(json);
  });
});

export default router;
