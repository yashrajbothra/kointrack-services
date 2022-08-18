/* eslint-disable no-shadow */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-param-reassign */
const instance = require('../axios/instance');
const connectors = require('../connectors');
const logger = require('../utils/logger');
const addServiceData = require('../utils/addServiceData');
const { addCryptocurrencyInfo, addCryptocurrencyLatest } = require('./cryptocurrency.service');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const addService = async (url, params = {}) => {
  if (!params?.length) params = [params];
  const currService = connectors[url];

  let chunk = 0;
  for await (const param of params) {
    logger.warn(`calling ${url} for ${chunk + 1} time\n`);

    if (!currService.setParams) currService.setParams = (data) => data;

    const currServiceData = await instance.get(
      url,
      { params: currService.setParams(param[chunk]) },
    )
      .then((res) => res.data.data).catch((err) => {
        logger.error(err);
      });

    if (Array.isArray(currServiceData)) {
      await addServiceData(currService, currServiceData);
    } else {
      await addServiceData(currService, [currServiceData]);
    }
    chunk += 1;
  }
};

const addSeviceMultiParams = async (url, params = {}) => {
  if (Object.keys(params).length === 0 || params.length <= 0) {
    logger.error('No Params to set \n');
    return;
  }

  // if (params.start % 5000 !== 0 && params.start !== 1) return;

  const currService = connectors[url];
  if (!currService?.setParams) currService.setParams = (params) => params;

  await delay(currService.interval);

  const tempParams = params.shift();
  try {
    const currServiceData = await instance.get(
      url,
      { params: currService.setParams({ ...tempParams }) },
    );
    await addSeviceMultiParams(url, params);
    const allServiceData = [];
    Object.values(currServiceData.data.data).forEach(async (serviceData) => {
      allServiceData.push(serviceData);
    });
    await addServiceData(currService, allServiceData);
  } catch (err) {
    await addSeviceMultiParams(url, params);
    logger.error(err);
  }
};

module.exports = {
  addService,
  addSeviceMultiParams,
  addCryptocurrencyInfo,
  addCryptocurrencyLatest,
};
