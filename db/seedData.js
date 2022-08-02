const slugger = require('../utils/slugger');

const providers = [
  {
    name: 'CoinMarketCap',
    baseUrl: 'https://pro-api.coinmarketcap.com',
    slug: slugger('CoinMarketCap'),
  },
];

module.exports = { providers };
