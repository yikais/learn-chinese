import fs from 'fs';
import { MongoClient } from 'mongodb';

let database;

export function connect(url, mongoCert = '', login = '', password = '') {
  const certificate = { useNewUrlParser: true };

  if (mongoCert) {
    try {
      certificate.sslCA = [fs.readFileSync(mongoCert)];
      certificate.sslValidate = true;
      certificate.checkServerIdentity = false;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  let urlWithAuth = url;
  if (login && password) {
    urlWithAuth = urlWithAuth.replace('://', `://${login}:${password}@`);
  }

  return MongoClient
    .connect(urlWithAuth, certificate)
    .then((db) => {
      db
        .on('reconnect', () => {
          // eslint-disable-next-line no-console
          console.info('database reconnected');
        })
        .on('close', (e) => {
          // eslint-disable-next-line no-console
          console.error(e);
        });

      database = db;
      return Promise.resolve(database);
    });
}


export function mongoCollection(collectionName) {
  if (!collectionName || typeof collectionName !== 'string') {
    throw new Error('collectName is required');
  }

  return database.db().collection(collectionName);
}
