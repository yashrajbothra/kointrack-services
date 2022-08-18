const jobs = require('./constants/jobs');

/**
 * Template of a batch
 * 'batch-name' : [
 *    job.name
 * ]
 */

module.exports = {
  'batch-1': [jobs.GLOBAL_METRICS_LATEST, jobs.CRYPTOCURRENCY_MAP],
  'batch-2': [jobs.CRYPTOCURRENCY_METADATA],
  'batch-3': [jobs.CRYPTOCURRENCY_MARKET_DETAILS, jobs.OHLCV],
  'batch-4': [jobs.BINANCE],
  'batch-5': [jobs.CRYPTOCURRENCY_TRENDING_METRICS, jobs.CRYPTOCURRENCY_MOST_VISITED_METRICS],
};
