module.exports = {
  '/v1/global-metrics/quotes/latest': {
    params() {},
    db: {
      name: 'globalMetrics',
    },
    query(apiData) {
      return {
        where: { timestamp: apiData.last_updated },
        create: {
          activeCryptocurrencies: apiData.active_cryptocurrencies,
          totalCryptocurrencies: apiData.total_cryptocurrencies,
          activeMarketPairs: apiData.active_market_pairs,
          activeExchanges: apiData.active_exchanges,
          totalExchanges: apiData.total_exchanges,
          ethDominance: apiData.eth_dominance,
          btcDominance: apiData.btc_dominance,
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
          totalMarketCap: apiData.quote.USD.total_market_cap,
          totalVolume24h: apiData.quote.USD.total_volume_24h,
          totalVolume24hReported: apiData.quote.USD.total_volume_24h_reported,
          altcoinVolume24h: apiData.quote.USD.altcoin_volume_24h,
          altcoinVolume24hReported: apiData.quote.USD.altcoin_volume_24h_reported,
          altcoinMarketCap: apiData.quote.USD.altcoin_market_cap,
          timestamp: apiData.last_updated,
        },
        update: {},
      };
    },
    queryType: 'upsert',
  },

  '/v2/cryptocurrency/info': {
    params(params) {
      return params;
    },
    db: { name: 'cryptocurrencyMetadata' },
    query(apiData) {
      return {
        data: {
          category: apiData.category,
          logoUrl: apiData.logo,
          description: apiData.description,
          notice: apiData.notice,
          selfReportedCirculatingSupply: apiData.self_reported_circulating_supply,
          selfReportedMarketCap: apiData.self_reported_market_cap,
          selfReportedTags: apiData.self_reported_tags,
          dateAdded: apiData.date_added,
          dateLaunched: apiData.date_launched,
          Cryptocurrency: {
            create: {
              name: apiData.name,
              slug: apiData.slug,
              symbol: apiData.symbol,
              Platform: {
                create: {
                  tokenAddress: apiData.token_address,
                },
              },
            },
          },
          Urls: {
            create: {
              website: apiData.urls.website,
              technicalDocumentation: apiData.urls.technical_documentation,
              explorer: apiData.urls.explorer,
              sourceCode: apiData.urls.source_code,
              messageBoard: apiData.urls.message_board,
              chat: apiData.chat,
              announcement: apiData.urls.announcement,
              reddit: apiData.urls.reddit,
              twitter: apiData.urls.twitter,
            },
          },
          Tags: { create: { name: apiData.name } },
        },
      };
    },
    queryType: 'create',
  },

  '/v1/cryptocurrency/listings/latest': {
    params(params) {
      return params;
    },

    db: { name: 'cryptocurrency' },
    query(apiData) {
      return {
        data: {
          name: apiData.name,
          symbol: apiData.symbol,
          MarketData: {
            create: {
              numMarketpair: apiData.num_market_pairs,
            },
          },
          Exchange: {
            create: {
              name: apiData.market_pairs.exchange.name,
              slug: apiData.market_pairs.exchange.slug,
              symbol: apiData.market_pairs.market_pair_base.symbol,
            },
            ExchangeMetadata: {
              create: {
                marketPairs: apiData.market_pairs.market_pair,
              },
              ExchnageCategory: {
                create: { category: apiData.market_pairs.category },
                ExchangeFee: {
                  create: {
                    feeType: apiData.market_pairs.fee_type,
                  },
                },
              },
            },
          },
        },
      };
    },
    queryType: 'create',
  },
  '/v1/exchange/info': {
    params(params) {
      return params;
    },
    db: { name: 'exchange' },
    query(apiData) {
      return {
        data: {
          name: apiData.name,
          slug: apiData.slug,
          ExchangeMetadata: {
            create: {
              logoUrl: apiData.logo,
              description: apiData.description,
              dateLaunched: apiData.date_launched,
              notice: apiData.notice,
              countries: apiData.countries,
              fiats: apiData.fiats,
              weeklyVisits: apiData.weekly_visits,
            },
          },
          Cryptocurrency: {
            Urls: {
              create: {
                website: apiData.urls.website,
                blog: apiData.urls.blog,
                chat: apiData.urls.chat,
                fee: apiData.urls.fee,
                twitter: apiData.urls.twitter,
              },
            },
          },
          ExchangeFee: {
            makerFee: apiData.maker_fee,
            takerFee: apiData.taker_fee,
          },
        },
      };
    },
    queryType: 'create',
  },
  '/v1/exchange/market-pairs/latest': {
    params(params) {
      return params;
    },
    db: { name: 'exchange' },
    query(apiData) {
      return {
        data: {
          name: apiData.name,
          slug: apiData.slug,
          MarketData: {
            create: {
              numMarketpair: apiData.num_market_pairs,
            },
          },
          Cryptocurrency: {
            create: {
              symbol: apiData.market_pairs.market_pair_base.currency_symbol,
            },
          },
          ExchangeMetadata: {
            create: {
              marketPairs: apiData.market_pairs.market_pair,
            },
            ExchnageCategory: {
              create: { category: apiData.market_pairs.category },
              ExchangeFee: {
                create: {
                  feeType: apiData.market_pairs.fee_type,
                },
              },
            },
          },
        },
      };
    },
    queryType: 'create',
  },
};
