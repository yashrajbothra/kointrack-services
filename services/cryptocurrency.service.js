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
  const mapping = connectors[url];
  delay(interval).then(async () => {
    const tempParams = params.shift();
    const currServiceData = await instance.get(
      url,
      { params: mapping.setParams({ ...tempParams }) },
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
    await addServiceData(mapping, allServiceData);
  });
};

const addCryptocurrencyOHLCV = async (url, params = {}) => {
  if (params.length <= 0) return;
  const mapping = connectors[url];
  delay(interval).then(async () => {
    const tempParams = params.shift();
    const currServiceData = await instance.get(
      url,
      { params: mapping.setParams({ ...tempParams }) },
    ).then((res) => {
      addCryptocurrencyOHLCV(url, params);
      return res.data.data;
    }).catch((err) => {
      addCryptocurrencyOHLCV(url, params);
      logger.error(err);
    });

    const allServiceData = [];
    Object.values(currServiceData).forEach(async (serviceData) => {
      allServiceData.push(serviceData);
    });
    await addServiceData(mapping, allServiceData);
  });
};

const addCryptocurrencyLatest = async (url, params = {}) => {
  if (params.start % 5000 !== 0 && params.start !== 1) return;
  const mapping = connectors[url];
  const currServiceData = await instance.get(
    url,
    { params: await mapping.setParams({ ...setParams }) },
  ).then((res) => {
    addCryptocurrencyLatest(url, {
      start: (
        res.config.setParams.start + res.data.data.length
      ) - 1,
    });
    return res.data.data;
  }).catch((err) => {
    logger.error(err);
  });
  await addServiceData(mapping, currServiceData);
};

module.exports = { addCryptocurrencyInfo, addCryptocurrencyLatest, addCryptocurrencyOHLCV };
