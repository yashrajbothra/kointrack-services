/* eslint-disable no-promise-executor-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-const-assign */
/* eslint-disable guard-for-in */
/* eslint-disable no-loop-func */
/* eslint-disable no-param-reassign */
const instance = require('../axios/instance');
const connectors = require('../connectors');
const logger = require('../utils/logger');
const addServiceData = require('../utils/addServiceData');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const interval = 3000;

const addCryptocurrencyInfo = async (url, params = {}) => {
  if (Object.keys(params).length === 0 || params.length <= 0) {
    logger.error('No Params to set \n');
    return;
  }
  const currService = connectors[url];
  delay(interval).then(async () => {
    const tempParams = params.shift();
    const currServiceData = await instance.get(
      url,
      { params: currService.setParams({ ...tempParams }) },
    ).then((res) => {
      addCryptocurrencyInfo(url, params);
      return res.data.data;
    }).catch((err) => {
      addCryptocurrencyInfo(url, params);
      logger.error(err);
    });

    const allServiceData = [];
    Object.values(currServiceData).forEach(async (serviceData) => {
      allServiceData.push(serviceData);
    });
    await addServiceData(currService, allServiceData);
  });
};

const addCryptocurrencyLatest = async (url, params = {}) => {
  const mapping = connectors[url];
  const currServiceData = await instance.get(
    url,
    { params: await mapping.setParams({ ...params }) },
  ).then((res) => {
    addCryptocurrencyLatest(url, {
      start: (
        res.config.params.start + res.data.data.length
      ) - 1,
    });
    return res.data.data;
  }).catch((err) => {
    logger.error(err);
  });
  await addServiceData(mapping, currServiceData);
};

module.exports = { addCryptocurrencyInfo, addCryptocurrencyLatest };
