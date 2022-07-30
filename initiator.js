const { addService } = require('./services');

const args = process.argv.slice(2);
const batchName = args.pop();

const allBatches = {
  'batch-1': [{
    name: 'globalMetricsLatest',
    url: '/v1/global-metrics/quotes/latest',
    interval: '600000',
  },
  ],
};

for (const batch in allBatches) {
  if (batch === batchName) {
    const currBatch = allBatches[batchName];
    currBatch.forEach((job) => {
      addService(job.url);
      setInterval(() => { addService(job.url); }, job.interval);
    });
  }
}
