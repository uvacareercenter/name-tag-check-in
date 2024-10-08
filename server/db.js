const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const lodashId = require('lodash-id');
const adapter = new FileAsync('db.json');

const get = async () => {
  const db = await low(adapter);
  db._.mixin(lodashId);
  return db;
};

const init = async () => {
  const db = await get();
  await db.defaults({ events: [] }).write();
};

module.exports = { get, init };
