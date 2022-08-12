/* eslint-disable no-param-reassign */
const prisma = require('./db');
const service = require('./services');
const logger = require('./utils/logger');

const args = process.argv.slice(2);
const batchName = args.pop();

const allBatches = {
  'batch-1': [
    {
      name: 'Global Metrics Latest',
      url: '/v1/global-metrics/quotes/latest',
      interval: '600000',
    },
    {
      name: 'Cryptocurrency',
      url: '/v1/cryptocurrency/map',
      interval: '600000',
      isMultiple: true,
    },
  ],
  'batch-2': [
    {
      name: 'Cryptocurrency Metadata',
      url: '/v2/cryptocurrency/info',
      interval: '600000',
      serviceName: 'addCryptocurrencyInfo',
      params: async () => {
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
    },
    {
      name: 'Cryptocurrency Trending Metrics',
      url: '/v1/cryptocurrency/trending/latest',
      interval: '600000',
      isMultiple: true,
      params: async (start = 1) => ({
        limit: 200,
        start,
      }),
    },
    {
      name: 'Cryptocurrency Most Visited Metrics',
      url: '/v1/cryptocurrency/trending/most-visited',
      interval: '600000',
      isMultiple: true,
      params: async (start = 1) => ({
        limit: 200,
        start,
      }),
    },
  ],
  'batch-3': [
    {
      name: 'Cryptocurrency Market Details',
      url: '/v1/cryptocurrency/listings/latest',
      interval: '600000',
      serviceName: 'addCryptocurrencyLatest',
      isMultiple: true,
      params: async (start = 1) => ({
        limit: 5000,
        start,
      }),
    },
    {
      name: 'OHLCV',
      url: '/v2/cryptocurrency/ohlcv/latest',
      interval: '900000',
      serviceName: 'addCryptocurrencyOHLCV',
      params: async () => {
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
    },
  ],
  'batch-4': [
    {
      name: 'Binance',
      url: '/v1/cryptocurrency/listings/latest',
      interval: '600000',
      serviceName: 'addCryptocurrencyLatest',
      isMultiple: true,
      params: async (start = 1) => ({
        limit: 5000,
        start,
      }),
    },
  ],
};

for (const batch in allBatches) {
  if (batch === batchName) {
    const currBatch = allBatches[batchName];
    currBatch.forEach(async (job) => {
      if (!job.params) job.params = async () => {};
      if (!job.serviceName) job.serviceName = 'addService';

      logger.info(`\n ${job.name} is started`);
      await service[job.serviceName](job.url, job.isMultiple, await job.params());
      setInterval(async () => {
        service[job.serviceName](job.url, job.isMultiple, await job.params());
      }, job.interval);
    });
  }
}
