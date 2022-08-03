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

const addCryptocurrencyMetadata = async (url, isMultiple, params = {}) => {
  if (params.length <= 0) return;
  const mapping = connectors[url];
  delay(interval).then(async () => {
    const tempParams = params.shift();
    const addServiceData = await instance.get(
      url,
      { params: mapping.params({ ...tempParams }) },
    ).then((res) => {
      addCryptocurrencyMetadata(url, isMultiple, params);
      return res.data.data;
    }).catch((err) => {
      logger.error(err);
    });

    const allServiceData = [];
    Object.values(addServiceData).forEach(async (serviceData) => {
      allServiceData.push(serviceData);
    });
    await addDataPromise(mapping, allServiceData);
  });
};

module.exports = addCryptocurrencyMetadata;
