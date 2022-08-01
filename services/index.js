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
  switch (mapping.queryType) {
    case 'upsert':
      if (isMultiple) {
        postedData = addServiceData.map(
          async (serviceData) => prisma[mapping.db.name][mapping.queryType](
            mapping.query(serviceData),
          ),
        );
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

  Promise.all(postedData).then((values) => {
    logger.info(JSON.stringify(values));
  });
};

module.exports = { addService };
