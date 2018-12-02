import dotenv from 'dotenv-extended';

dotenv.config();

module.exports = {
  mongo: {
    url: process.env.MONGO_URL,
    collectionName: process.env.MONGO_COLLECTION_NAME,
  },
  port: process.env.PORT,
  allowExplorer: process.env.ALLOW_EXPLORER,
};
