const logger = require('./utils/logger');
const batches = require('./batches');
const service = require('./services');

const args = process.argv.slice(2);
const currBatchName = args.pop();
const startService = async (currJob) => {
  logger.warn(`${currJob.name} is started \n`);
  await service[currJob.serviceName](currJob.url, await currJob.getParams());
  logger.warn(`${currJob.name} is ended`);
};

for (const batch in batches) {
  if (batch === currBatchName) {
    const currBatch = batches[currBatchName];
    currBatch.forEach(async (job) => {
      const currJob = job;
      // setting default values for service function
      if (!currJob.getParams) currJob.getParams = async () => {};
      if (!currJob.serviceName) currJob.serviceName = 'addService';

      await startService(currJob);
      setInterval(async () => {
        await startService(currJob);
      }, currJob.interval);
    });
  }
}
