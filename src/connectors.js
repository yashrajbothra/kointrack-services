const connectors = require('./constants/mapping');

/**
* Template of a connectors
* 'connectorUrl': {
*       connectors.name
*     }
*
*/

module.exports = {
  '/v1/global-metrics/quotes/latest': connectors.GLOBAL_METRICS_LATEST,
  '/v1/cryptocurrency/map': connectors.CRYPTOCURRENCY_MAP,
  '/v2/cryptocurrency/info': connectors.CRYPTOCURRENCY_METADATA,
  '/v1/cryptocurrency/listings/latest': connectors.CRYPPTOCURRENCY_LISTINGS_LATEST,
  '/v1/cryptocurrency/trending/latest': connectors.CRYPTOCURRENCY_TRENDING_LATEST,
  '/v1/cryptocurrency/trending/most-visited': connectors.CRYPTOCURRENCY_MOST_VIISTED,
  '/v2/cryptocurrency/ohlcv/latest': connectors.OHLCV,
  '/v1/exchange/map': connectors.EXCHANGE_MAP,
};
