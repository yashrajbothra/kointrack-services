const logger = require('./src/utils/logger');
const batches = require('./src/batches');
const service = require('./src/services');

const args = process.argv.slice(2);
const currBatchName = args.pop();

if (!batches[currBatchName]) {
  logger.warn("This batch doesn't exist");
  process.exit();
}

const startService = async (currJob) => {
  logger.warn(`${currJob.name} is started`);
  await service[currJob.serviceName](currJob.url, await currJob.getParams(), currJob.interval);
  logger.warn(`${currJob.name} is ended`);
};

const currBatch = batches[currBatchName];
currBatch.forEach(async (job) => {
  const currJob = job;
  // setting default values for service function
  if (!currJob.getParams) currJob.getParams = async (params) => params;
  if (!currJob.serviceName) currJob.serviceName = 'addService';

  await startService(currJob);
  setInterval(async () => {
    await startService(currJob);
  }, currJob.interval);
});
