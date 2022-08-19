const slugger = require('../utils/slugger');

const providers = [
  {
    name: 'CoinMarketCap',
    baseUrl: 'https://pro-api.coinmarketcap.com',
    slug: slugger('CoinMarketCap'),
  },
  {
    name: 'Binance',
    baseUrl: 'https://api.binance.com',
    slug: slugger('binance'),
  },
];

module.exports = { providers };
