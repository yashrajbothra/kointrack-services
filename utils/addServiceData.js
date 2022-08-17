/* eslint-disable no-param-reassign */
const prisma = require('../db');
const logger = require('./logger');

const addServiceData = async (service, serviceData, key = 1) => {
  if (serviceData.length <= 0) {
    logger.warn('No data found in provider service call');
    return;
  }

  serviceData[0].key = key;
  prisma[service.db.name][service.queryType](
    await service.query(serviceData[0]),
  ).then((res) => {
    logger.info(JSON.stringify(res));
    serviceData.shift();
    if (serviceData.length > 0) {
      addServiceData(service, serviceData, key + 1);
    }
  }, (err) => {
    logger.error(err);
  });
};

module.exports = addServiceData;
