const prisma = require('../db');
const logger = require('./logger');

const addDataPromise = async (mapping, serviceData) => {
  const postedData = [];

  if (serviceData.length <= 0) return logger.info(JSON.stringify(postedData));
  await prisma[mapping.db.name][mapping.queryType](
    mapping.query(serviceData[0]),
  ).then((res) => {
    postedData.push(res);
    serviceData.shift();
    addDataPromise(mapping, serviceData);
  }).catch((res) => {
    logger.info(JSON.stringify(postedData));
    logger.error(res);
  });

  return postedData;
};

module.exports = addDataPromise;
