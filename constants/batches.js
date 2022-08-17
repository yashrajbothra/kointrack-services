const prisma = require('../db');
const logger = require('../utils/logger');

/**
 * Template of a batch
 * 'batch-name' : [
 *  {
 *    'name' : 'Name of the Service' (used only to display in log),
 *    'url' : 'Url of the providers api' (used to call and get data from provider),
 *    'interval' : 'Interval in which the service will loop (in Milliseconds),
 *    'getParams' : (params) => { return params } (Generate the parameters based on this function),
 *    'serviceName' : 'serviceName' (Name of custom service. By default is 'addService'),
 *  }
 * ]
 */

const GLOBAL_MATRICS_LATEST = {
  name: 'Global Metrics Latest',
  url: '/v1/global-metrics/quotes/latest',
  interval: '600000',
};
const CRYPTOCURRENCY_MAPDATA = {
  name: 'Cryptocurrency Datamap',
  url: '/v1/cryptocurrency/map',
  interval: '600000',
};
const CRYPTOCURRENCY_METADATA = {
  name: 'Cryptocurrency Metadata',
  url: '/v2/cryptocurrency/info',
  interval: '600000',
  serviceName: 'addCryptocurrencyInfo',
  getParams: async () => {
    const resources = await prisma.cryptocurrency.findMany({
      select: {
        resourceId: true,
      },
      where: {
        providerId: 1,
      },
    });

    if (resources.length <= 0) {
      logger.error('No data in cryptocurrency table\n');
      return {};
    }

    let paramsArr = [];
    const params = [];
    resources.forEach((resource, i) => {
      // 100-700 call capacity
      if ((i + 1) % 100 === 0) {
        paramsArr.push(resource.resourceId);
        params.push({ id: paramsArr.join(',') });
        paramsArr = [];
      } else {
        paramsArr.push(resource.resourceId);
      }
    });
    params.push({ id: paramsArr.join(',') });
    return params;
  },
};
const CRYPTOCURRENCY_MARKET_DETAILS = {
  name: 'Cryptocurrency Market Details',
  url: '/v1/cryptocurrency/listings/latest',
  interval: '600000',
  serviceName: 'addCryptocurrencyLatest',
  getParams: async (start = 1) => ({
    limit: 5000,
    start,
  }),
};
const OHLCV = {
  name: 'OHLCV',
  url: '/v2/cryptocurrency/ohlcv/latest',
  interval: '900000',
  serviceName: 'addCryptocurrencyOHLCV',
  getParams: async () => {
    const resources = await prisma.cryptocurrency.findMany({
      select: {
        resourceId: true,
      },
      where: {
        providerId: 1,
      },
    });

    let paramsArr = [];
    const params = [];
    resources.forEach((resource, i) => {
      // 100-700 call capacity
      if ((i + 1) % 100 === 0) {
        paramsArr.push(resource.resourceId);
        params.push({ id: paramsArr.join(',') });
        paramsArr = [];
      } else {
        paramsArr.push(resource.resourceId);
      }
    });
    params.push({ id: paramsArr.join(',') });
    return params;
  },
};
const BINANCE = {
  name: 'Binance',
  url: '/v1/cryptocurrency/listings/latest',
  interval: '600000',
  serviceName: 'addCryptocurrencyLatest',
  getParams: async (start = 1) => ({
    limit: 5000,
    start,
  }),
};
const CRYPTOCURRENCY_TRENDING_MATRICS = {
  name: 'Cryptocurrency Trending Metrics',
  url: '/v1/cryptocurrency/trending/latest',
  interval: '600000',
  getParams: async (start = 1) => ({
    limit: 200,
    start,
  }),
};
const CRYPTOCURRENCY_MOST_VISITED_MATRICS = {
  name: 'Cryptocurrency Most Visited Metrics',
  url: '/v1/cryptocurrency/trending/most-visited',
  interval: '600000',
  getParams: async (start = 1) => ({
    limit: 200,
    start,
  }),
};
module.exports = {
  'batch-1': [GLOBAL_MATRICS_LATEST, CRYPTOCURRENCY_MAPDATA],
  'batch-2': [CRYPTOCURRENCY_METADATA],
  'batch-3': [CRYPTOCURRENCY_MARKET_DETAILS, OHLCV],
  'batch-4': [BINANCE],
  'batch-5': [CRYPTOCURRENCY_TRENDING_MATRICS, CRYPTOCURRENCY_MOST_VISITED_MATRICS],
};
