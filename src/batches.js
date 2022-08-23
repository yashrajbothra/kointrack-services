const jobs = require('./constants/jobs');

/**
 * Template of a batch
 * 'batch-name' : [
 *    job.name
 * ]
 */

module.exports = {
  'batch-1': [jobs.CRYPTOCURRENCY_MAP],
  'batch-2': [
    jobs.CRYPTOCURRENCY_TRENDING_METRICS,
    jobs.CRYPTOCURRENCY_MOST_VISITED_METRICS,
    jobs.CRYPTOCURRENCY_MARKET_DETAILS,
    jobs.CRYPTOCURRENCY_METADATA,
  ],
  'batch-3': [jobs.OHLCV, jobs.GLOBAL_METRICS_LATEST],
  'batch-4': [jobs.EXCHANGE_MAP],
};
