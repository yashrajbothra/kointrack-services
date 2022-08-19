const jobs = require('../constants/jobs');

/**
 * Template of a batch
 * 'batch-name' : [
 *    job.name
 * ]
 */

module.exports = {
  'batch-1': [jobs.GLOBAL_METRICS_LATEST],
  'batch-2': [jobs.CRYPTOCURRENCY_MAP],
  'batch-3': [jobs.CRYPTOCURRENCY_METADATA],
  'batch-4': [jobs.CRYPTOCURRENCY_TRENDING_METRICS],
  'batch-5': [jobs.CRYPTOCURRENCY_MARKET_DETAILS],
  'batch-6': [jobs.OHLCV],
  'batch-7': [jobs.CRYPTOCURRENCY_MOST_VISITED_METRICS],
};
