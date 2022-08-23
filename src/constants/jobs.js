const prisma = require('../db');
const logger = require('../utils/logger');

/**
 * Template of a batch
 * jobs = {
 *    'name' : 'Name of the Service' (used only to display in log),
 *    'url' : 'Url of the providers api' (used to call and get data from provider),
 *    'interval' : 'Interval in which the service will loop (in Milliseconds),
 *    'getParams' : (params) => { return params } (Generate the parameters based on this function),
 *    'serviceName' : 'serviceName' (Name of custom service. By default is 'addService'),
 *  }
 */

const jobs = {};

jobs.CRYPTOCURRENCY_MAP = {
  name: 'Cryptocurrency Map',
  url: '/v1/cryptocurrency/map',
  interval: '86400000', // 24H
};

jobs.CRYPTOCURRENCY_METADATA = {
  name: 'Cryptocurrency Metadata',
  url: '/v2/cryptocurrency/info',
  interval: '3600000', // 1H
  serviceName: 'addSeviceMultiParams',
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

jobs.CRYPTOCURRENCY_MARKET_DETAILS = {
  name: 'Cryptocurrency Market Details',
  url: '/v1/cryptocurrency/listings/latest',
  interval: '3600000', // 1H
  serviceName: 'addSeviceMultiParams',
  getParams: async () => {
    const { resourceId: cryptoCount } = await prisma.cryptocurrency.count({
      select: {
        resourceId: true,
      },
      where: {
        providerId: 1,
      },
    });

    const params = [];
    for (let i = 1; i <= cryptoCount; i += 5000) {
      params.push({
        limit: 5000,
        start: i,
      });
    }
    return params;
  },
};

jobs.CRYPTOCURRENCY_TRENDING_METRICS = {
  name: 'Cryptocurrency Trending Metrics',
  url: '/v1/cryptocurrency/trending/latest',
  interval: '600000', // 1H
  getParams: async (start = 1) => ({
    limit: 200,
    start,
  }),
};

jobs.CRYPTOCURRENCY_MOST_VISITED_METRICS = {
  name: 'Cryptocurrency Most Visited Metrics',
  url: '/v1/cryptocurrency/trending/most-visited',
  interval: '600000', // 1H
  getParams: async (start = 1) => ({
    limit: 200,
    start,
  }),
};

jobs.OHLCV = {
  name: 'OHLCV',
  url: '/v2/cryptocurrency/ohlcv/latest',
  interval: '900000', // 15Min
  serviceName: 'addSeviceMultiParams',
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

jobs.GLOBAL_METRICS_LATEST = {
  name: 'Global Metrics Latest',
  url: '/v1/global-metrics/quotes/latest',
  interval: '600000', // 10Min,
};

jobs.EXCHANGE_MAP = {
  name: 'Exchange Map',
  url: '/v1/exchange/map',
  interval: '86400000', // 24H
};

module.exports = jobs;
