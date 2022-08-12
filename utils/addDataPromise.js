/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const prisma = require('../db');
const logger = require('./logger');

const addDataPromise = async (mapping, serviceData, key = 1) => {
  const postedData = [];

  if (serviceData.length <= 0) return logger.info(JSON.stringify(postedData));
  serviceData[0].key = key;
  prisma[mapping.db.name][mapping.queryType](
    await mapping.query(serviceData[0]),
  ).then((res) => {
    postedData.push(res);
    serviceData.shift();
    addDataPromise(mapping, serviceData, key + 1);
  }, (err) => {
    logger.error(err);
  });

  logger.info(JSON.stringify(postedData));
};

module.exports = addDataPromise;
