const Promise = require('bluebird');
const prisma = require('../db');
const instance = require('../axios/instance');
const connectors = require('../connectors');
const logger = require('../utils/logger');

const addService = async (url, isMultiple, params = {}) => {
  const mapping = connectors[url];
  const addServiceData = await instance.get(url, { params: mapping.params({ ...params }) })
    .then((res) => res.data.data).catch((err) => {
      logger.error(err);
    });

  let postedData;

  const upsertPromise = async (serviceData) => {
    await prisma[mapping.db.name][mapping.queryType](
      mapping.query(serviceData[0]),
    ).then((res) => {
      logger.info(JSON.stringify(res));
      serviceData.shift();
      upsertPromise(serviceData);
    });
  };

  switch (mapping.queryType) {
    case 'upsert':
      if (isMultiple) {
        await upsertPromise(addServiceData);
      } else {
        postedData = [await prisma[mapping.db.name][mapping.queryType](
          mapping.query(addServiceData),
        )];
      }
      break;

    default:
      postedData = await prisma[mapping.db.name].create(mapping.query(addServiceData));
      break;
  }
};

module.exports = { addService };
