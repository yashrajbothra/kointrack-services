const prisma = require('../db');
const instance = require('../axios/instance');
const connectors = require('../connectors');
const logger = require('../utils/logger');

const addService = async (url, params = {}) => {
  const mapping = connectors[url];
  const addServiceData = await instance.get(url, { params: mapping.params(params) })
    .then((res) => res.data.data);

  let postedData;
  switch (mapping.queryType) {
    case 'upsert':
      postedData = await prisma[mapping.db.name].upsert({
        where: mapping.upsertOn(addServiceData),
        create: mapping.query(addServiceData),
        update: {},
      });
      break;

    default:
      postedData = await prisma[mapping.db.name].create(mapping.query(addServiceData));
      break;
  }

  return logger.info(JSON.stringify(postedData));
};

module.exports = { addService };
