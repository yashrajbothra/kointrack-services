module.exports = {
  '/v1/global-metrics/quotes/latest': {
    params: {},
    db: {
      name: 'globalMetrics',
    },
    query(apiData) {
      return {
        activeCryptocurrencies: apiData.active_cryptocurrencies,
        totalCryptocurrencies: apiData.total_cryptocurrencies,
        activeMarketPairs: apiData.active_market_pairs,
        activeExchanges: apiData.active_exchanges,
        totalExchanges: apiData.total_exchanges,
        ethDominance: apiData.eth_dominance,
        btcDominance: apiData.btc_dominance,
        ethDominanceYesterday: apiData.eth_dominance_yesterday,
        btcDominanceYesterday: apiData.btc_dominance_yesterday,
        ethDominance24hPercentageChange: apiData.eth_dominance_24h_percentage_change,
        btcDominance24hPercentageChange: apiData.btc_dominance_24h_percentage_change,
        defiVolume24h: apiData.defi_volume_24h,
        defiVolume24hReported: apiData.defi_volume_24h_reported,
        defi24hPercentageChange: apiData.defi_24h_percentage_change,
        defiMarketCap: apiData.defi_market_cap,
        stablecoinVolume24h: apiData.active_cryptocurrencies,
        stablecoinVolume24hReported: apiData.stablecoin_volume_24h_reported,
        stablecoinMarketCap: apiData.stablecoin_market_cap,
        stablecoin24hPercentageChange: apiData.stablecoin_24h_percentage_change,
        derivativesVolume24h: apiData.derivatives_volume_24h,
        derivativesVolume24hReported: apiData.derivatives_volume_24h_reported,
        derivatives24hPercentageChange: apiData.derivatives_24h_percentage_change,
        timestamp: apiData.last_updated,
      };
    },
    queryType: 'upsert',
    upsertOn: (apiData) => ({ timestamp: apiData.last_updated }),
  },
};
