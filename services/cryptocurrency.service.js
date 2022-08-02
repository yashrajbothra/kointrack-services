/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-const-assign */
/* eslint-disable guard-for-in */
/* eslint-disable no-loop-func */
/* eslint-disable no-param-reassign */
const instance = require('../axios/instance');
const connectors = require('../connectors');
const logger = require('../utils/logger');
const addDataPromise = require('../utils/addDataPromise');

const addCryptocurrencyMetadata = async (url, isMultiple, params = {}) => {
  const mapping = connectors[url];
  const chunkSize = params.length;

  for (let chunk = 0; chunk < chunkSize; chunk += 1) {
    (async () => {
      const addServiceData = await instance.get(
        url,
        { params: mapping.params({ ...params[chunk] }) },
      ).then((res) => res.data.data).catch((err) => {
        logger.error(err);
      });

      const allServiceData = [];
      Object.values(addServiceData).forEach(async (serviceData) => {
        allServiceData.push(serviceData);
      });
      await addDataPromise(mapping, allServiceData);
    })();
  }
};

module.exports = addCryptocurrencyMetadata;
