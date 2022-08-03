/* eslint-disable no-param-reassign */
const prisma = require('./db');
const service = require('./services');

const args = process.argv.slice(2);
const batchName = args.pop();

const allBatches = {
  'batch-1': [
    {
      name: 'globalMetricsLatest',
      url: '/v1/global-metrics/quotes/latest',
      interval: '600000',
    },
  ],
  'batch-2': [
    {
      name: 'Cryptocurrency',
      url: '/v1/cryptocurrency/map',
      interval: '600000',
      isMultiple: true,
    },
  ],
  'batch-3': [
    {
      name: 'Cryptocurrency Metadata',
      url: '/v2/cryptocurrency/info',
      interval: '600000',
      serviceName: 'addCryptocurrencyMetadata',
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
};

for (const batch in allBatches) {
  if (batch === batchName) {
    const currBatch = allBatches[batchName];
    currBatch.forEach(async (job) => {
      if (!job.params) job.params = async () => {};
      if (!job.serviceName) job.serviceName = 'addService';
      await service[job.serviceName](job.url, job.isMultiple, await job.params());
      // setInterval(async () => {
      //   service[job.serviceName](job.url, job.isMultiple, await job.params());
      // }, job.interval);
    });
  }
}
