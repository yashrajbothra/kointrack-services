const prisma = require('../db');
const logger = require('./logger');

const addDataPromise = async (mapping, serviceData) => {
  const postedData = [];

  if (serviceData.length <= 0) return logger.info(JSON.stringify(postedData));
  await prisma[mapping.db.name][mapping.queryType](
    await mapping.query(serviceData[0]),
  ).then((res) => {
    postedData.push(res);
    serviceData.shift();
    addDataPromise(mapping, serviceData);
  }, (err) => {
    logger.error(err);
  });

  logger.info(JSON.stringify(postedData));
};

module.exports = addDataPromise;
