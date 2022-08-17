/* eslint-disable no-param-reassign */
const instance = require('../axios/instance');
const connectors = require('../connectors');
const logger = require('../utils/logger');
const addServiceData = require('../utils/addServiceData');
const { addCryptocurrencyInfo, addCryptocurrencyLatest, addCryptocurrencyOHLCV } = require('./cryptocurrency.service');

const addService = async (url, params = {}) => {
  const currService = connectors[url];

  for (let chunk = 0; chunk < (params.length ?? 1); chunk += 1) {
    (async () => {
      logger.warn(`calling ${url} for ${chunk + 1} time\n`);

      if (!currService.setParams) currService.setParams = (data) => data;

      const currServiceData = await instance.get(
        url,
        { params: currService.setParams({ ...params[chunk] }) },
      )
        .then((res) => res.data.data).catch((err) => {
          logger.error(err);
        });

      if (Array.isArray(currServiceData)) {
        await addServiceData(currService, currServiceData);
      } else {
        await addServiceData(currService, [currServiceData]);
      }
    })();
  }
};

module.exports = {
  addService, addCryptocurrencyInfo, addCryptocurrencyLatest, addCryptocurrencyOHLCV,
};
