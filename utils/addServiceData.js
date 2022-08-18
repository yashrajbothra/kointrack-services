/* eslint-disable no-param-reassign */
const prisma = require('../db');
const logger = require('./logger');

const addServiceData = async (service, serviceData, key = 1) => {
  if (serviceData.length <= 0) {
    logger.warn('No data found in provider service call');
    return;
  }

  serviceData[0].key = key;
  try {
    const result = await prisma[service.db.name][service.queryType](
      await service.query(serviceData[0]),
    );
    logger.info(JSON.stringify(result));
    serviceData.shift();
    await addServiceData(service, serviceData, key + 1);
  } catch (err) {
    logger.error(`Error running the service prisma query : \n ${err}`);
  }
};

module.exports = addServiceData;
