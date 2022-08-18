const jobs = require('./constants/jobs');

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

module.exports = {
  'batch-1': [jobs.GLOBAL_METRICS_LATEST, jobs.CRYPTOCURRENCY_MAP],
  'batch-2': [jobs.CRYPTOCURRENCY_METADATA],
  'batch-3': [jobs.CRYPTOCURRENCY_MARKET_DETAILS, jobs.OHLCV],
  'batch-4': [jobs.BINANCE],
  'batch-5': [jobs.CRYPTOCURRENCY_TRENDING_METRICS, jobs.CRYPTOCURRENCY_MOST_VISITED_METRICS],
};
