const prisma = require('../db');
const instance = require('../axios/instance');
const connectors = require('../connectors');
const logger = require('../utils/logger');

const addService = async (url) => {
  const mapping = connectors[url];
  const addServiceData = await instance.get(url, { params: mapping.params })
    .then((res) => res.data.data);

  let postedData;
  switch (mapping.queryType) {
    case 'upsert':
      postedData = await prisma[mapping.db.name][mapping.queryType](
        mapping.query(addServiceData),
      );
      break;

    default:
      postedData = await prisma[mapping.db.name].create(mapping.query(addServiceData));
      break;
  }

  return logger.info(JSON.stringify(postedData));
};

module.exports = { addService };
