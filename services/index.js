/* eslint-disable no-param-reassign */
const instance = require('../axios/instance');
const connectors = require('../connectors');
const logger = require('../utils/logger');
const addDataPromise = require('../utils/addDataPromise');
const { addCryptocurrencyInfo, addCryptocurrencyLatest } = require('./cryptocurrency.service');

const addService = async (url, isMultiple, params = {}) => {
  const mapping = connectors[url];
  let chunkSize = 1;

  if (Array.isArray(params)) {
    chunkSize = params.length;
  }

  for (let chunk = 0; chunk < chunkSize; chunk += 1) {
    (async () => {
      const addServiceData = await instance.get(
        url,
        { params: mapping.params({ ...params[chunk] }) },
      )
        .then((res) => res.data.data).catch((err) => {
          logger.error(err);
        });

      if (isMultiple) {
        await addDataPromise(mapping, addServiceData);
      } else {
        await addDataPromise(mapping, [addServiceData]);
      }
    })();
  }
};

module.exports = { addService, addCryptocurrencyInfo, addCryptocurrencyLatest };
