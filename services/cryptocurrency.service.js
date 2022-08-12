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
const addDataPromise = require('../utils/addDataPromise');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const interval = 3000;

const addCryptocurrencyInfo = async (url, isMultiple, params = {}) => {
  if (params.length <= 0) return;
  const mapping = connectors[url];
  delay(interval).then(async () => {
    const tempParams = params.shift();
    const addServiceData = await instance.get(
      url,
      { params: mapping.params({ ...tempParams }) },
    ).then((res) => {
      addCryptocurrencyInfo(url, isMultiple, params);
      return res.data.data;
    }).catch((err) => {
      addCryptocurrencyInfo(url, isMultiple, params);
      logger.error(err);
    });

    const allServiceData = [];
    Object.values(addServiceData).forEach(async (serviceData) => {
      allServiceData.push(serviceData);
    });
    await addDataPromise(mapping, allServiceData);
  });
};

const addCryptocurrencyOHLCV = async (url, isMultiple, params = {}) => {
  if (params.length <= 0) return;
  const mapping = connectors[url];
  delay(interval).then(async () => {
    const tempParams = params.shift();
    const addServiceData = await instance.get(
      url,
      { params: mapping.params({ ...tempParams }) },
    ).then((res) => {
      addCryptocurrencyOHLCV(url, isMultiple, params);
      return res.data.data;
    }).catch((err) => {
      addCryptocurrencyOHLCV(url, isMultiple, params);
      logger.error(err);
    });

    const allServiceData = [];
    Object.values(addServiceData).forEach(async (serviceData) => {
      allServiceData.push(serviceData);
    });
    await addDataPromise(mapping, allServiceData);
  });
};

const addCryptocurrencyLatest = async (url, isMultiple, params = {}) => {
  if (params.start % 5000 !== 0 && params.start !== 1) return;
  const mapping = connectors[url];
  const addServiceData = await instance.get(
    url,
    { params: await mapping.params({ ...params }) },
  ).then((res) => {
    addCryptocurrencyLatest(url, isMultiple, {
      start: (
        res.config.params.start + res.data.data.length
      ) - 1,
    });
    return res.data.data;
  }).catch((err) => {
    logger.error(err);
  });
  await addDataPromise(mapping, addServiceData);
};

module.exports = { addCryptocurrencyInfo, addCryptocurrencyLatest, addCryptocurrencyOHLCV };
