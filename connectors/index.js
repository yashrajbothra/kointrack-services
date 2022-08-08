const prisma = require('../db');
const slugger = require('../utils/slugger');
const deleteObjPair = require('../utils/deleteObjPair');

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
          totalMarketCapYesterday: apiData.quote.USD.total_market_cap_yesterday,
          totalMarketCapYesterdayPercentageChange: apiData
            .quote.USD.total_market_cap_yesterday_percentage_change,
          totalVolume24h: apiData.quote.USD.total_volume_24h,
          totalVolume24hYesterday: apiData.quote.USD.total_volume_24h_yesterday,
          totalVolume24hYesterdayPercentageChange: apiData
            .quote.USD.total_volume_24h_yesterday_percentage_change,
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

  '/v1/cryptocurrency/map': {
    params(params) {
      return params;
    },
    db: { name: 'cryptocurrency' },
    query(apiData) {
      let platformData;
      if (apiData.platform?.id) {
        platformData = {
          connectOrCreate:
        {
          where: {
            parentCryptoId: apiData.platform.id,
          },
          create: {
            parentCryptoId: apiData.platform.id,
          },
        },
        };
      }

      return {
        where: {
          resource: {
            resourceId: apiData.id,
            providerId: 1,
          },
        },
        update: {
          rank: apiData.rank,
        },
        create: {
          provider: {
            connect: {
              id: 1,
            },
          },
          resourceId: apiData.id,
          name: apiData.name,
          symbol: apiData.symbol,
          slug: apiData.slug,
          isActive: Boolean(apiData.is_active),
          firstHistoricalData: apiData.first_historical_data,
          tokenAddress: apiData.platform?.token_address,
          rank: apiData.rank,
          platform: platformData,
        },
      };
    },
    queryType: 'upsert',
  },

  '/v2/cryptocurrency/info': {
    params(params) {
      return params;
    },
    db: { name: 'cryptocurrencyMetadata' },
    query: async (apiData) => {
      const { id: cryptoId } = await prisma.cryptocurrency.findUnique({
        where: {
          resource: {
            providerId: 1,
            resourceId: apiData.id,
          },
        },
      });

      let tagsPromises = apiData.tags?.map(async (tag, i) => {
        const tagsData = await prisma.tags.upsert({
          create: {
            name: apiData['tag-names'][i],
            tagsGroup: {
              connectOrCreate: {
                create: {
                  name: apiData['tag-groups'][i],
                },
                where: {
                  name: apiData['tag-groups'][i],
                },
              },
            },
            slug: tag,
          },
          where: {
            slug: tag,
          },
          update: {},
        });
        return tagsData;
      });
      if (tagsPromises === undefined) tagsPromises = [];
      let tagsData = await Promise.all(tagsPromises);
      tagsData = tagsData.map((tags) => deleteObjPair(tags, ['name', 'slug', 'tagsGroupId']));

      const data = {
        category: {
          connectOrCreate: {
            where: {
              name: apiData.category,
            },
            create: {
              name: apiData.category,
              slug: slugger(apiData.category, '_'),
            },
          },
        },
        logoUrl: apiData.logo,
        description: apiData.description,
        notice: apiData.notice,
        selfReportedCirculatingSupply: apiData.self_reported_circulating_supply,
        selfReportedMarketCap: apiData.self_reported_market_cap,
        // selfReportedTags: apiData.self_reported_tags,
        dateAdded: apiData.date_added,
        dateLaunched: apiData.date_launched,
        cryptocurrency: {
          connect: {
            cryptoId,
          },
        },
        urls: {
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
        tags: {
          connect: tagsData,
        },
      };

      return {
        create: data,
        where: {
          cryptoId,
        },
        update: data,
      };
    },
    queryType: 'upsert',
  },

  '/v1/cryptocurrency/listings/latest': {
    params(params) {
      return params;
    },
    db: { name: 'cryptocurrencyMetadata' },
    query: async (apiData) => {
      const crypto = await prisma.cryptocurrency.findUnique({
        select: {
          id: true,
        },
        where: {
          resource: {
            providerId: 1,
            resourceId: apiData.id,
          },
        },
      });
      if (!crypto) {
        return {
          where: {
            cryptoId: 1,
          },
          data: {},
        };
      }
      const cryptoMeta = await prisma.cryptocurrencyMetadata.findUnique({
        select: {
          cryptoId: true,
        },
        where: {
          cryptoId: crypto.id,
        },
      });
      if (!cryptoMeta) {
        return {
          where: {
            cryptoId: 1,
          },
          data: {},
        };
      }

      const data = {
        numMarketPairs: apiData.num_market_pairs,
        maxSupply: apiData.max_supply,
        circulatingSupply: apiData.circulating_supply,
        totalSupply: apiData.total_supply,
        selfReportedCirculatingSupply: apiData.self_reported_circulating_supply,
        selfReportedMarketCap: apiData.self_reported_market_cap,
        volume24h: apiData.quote.USD.volume_24h,
        volumeChange24h: apiData.quote.USD.volume_change_24h,
        pricePercentageChange1h: apiData.quote.USD.percent_change_1h,
        pricePercentageChange24h: apiData.quote.USD.percent_change_24h,
        pricePercentageChange30d: apiData.quote.USD.percent_change_30d,
        pricePercentageChange60d: apiData.quote.USD.percent_change_60d,
        pricePercentageChange90d: apiData.quote.USD.percent_change_90d,
        marketCapDominance: apiData.quote.USD.market_cap_dominance,
      };

      return {
        where: {
          cryptoId: cryptoMeta?.cryptoId,
        },
        data,
      };
    },
    queryType: 'update',
  },

  '/v1/cryptocurrency/ohlcv/latest': {
    params(params) {
      return params;
    },
    db: { name: 'cryptocurrency' },
    query(apiData) {
      let platformData;
      if (apiData.platform?.id) {
        platformData = {
          connectOrCreate:
        {
          where: {
            parentCryptoId: apiData.platform.id,
          },
          create: {
            parentCryptoId: apiData.platform.id,
          },
        },
        };
      }

      return {
        data: {
          provider: {
            connect: {
              id: 1,
            },
          },
          resourceId: apiData.id,
          name: apiData.name,
          symbol: apiData.symbol,
          slug: apiData.slug,
          isActive: Boolean(apiData.is_active),
          firstHistoricalData: apiData.first_historical_data,
          tokenAddress: apiData.platform?.token_address,
          rank: apiData.rank,
          platform: platformData,
        },
      };
    },
    queryType: 'create',
  },

};
