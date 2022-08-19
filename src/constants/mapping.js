const prisma = require('../db');
const slugger = require('../utils/slugger');
const deleteObjPair = require('../utils/deleteObjPair');
const logger = require('../utils/logger');

/**
 * Template of a connectors
 * connectors : [
 *  {
 *    'db': {
 *      'name' : 'Name of the DB',
 *    },
 *    'interval': 'time takes to start this service(Milliseconds)'
 *    'setParams': (params) =>{ }(Generate the query based on this params)
 *    'query' : (apiData) => {  } (used to generate prisma query),
 *    'queryType' : 'type of query used in prisma',
 *
 *  }
 * ]
 */

const connectors = {};
connectors.GLOBAL_METRICS_LATEST = {
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
};
connectors.CRYPTOCURRENCY_MAP = {
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
};
connectors.CRYPTOCURRENCY_METADATA = {
  db: { name: 'cryptocurrencyMetadata' },
  interval: 3000,
  query: async (apiData) => {
    const { id: cryptoId } = await prisma.cryptocurrency.findUnique({
      where: {
        resource: {
          providerId: 1,
          resourceId: apiData.id,
        },
      },
    });

    const tagsData = [];
    if (apiData.tags) {
      for await (const [i, tag] of apiData.tags.entries()) {
        try {
          const currTagData = await prisma.tags.upsert({
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
          tagsData.push(deleteObjPair(currTagData, ['name', 'slug', 'tagsGroupId']));
        } catch (err) {
          logger.error(`Tags Data has some error check the data below:- \n ${err}`);
        }
      }
    }
    const data = {
      category: {
        connectOrCreate: {
          where: {
            name: apiData.category,
          },
          create: {
            name: apiData.category,
            slug: slugger(apiData.category),
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
          id: cryptoId,
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

    const updateData = deleteObjPair(data, ['cryptocurrency']);

    return {
      create: data,
      where: {
        cryptoId,
      },
      update: updateData,
    };
  },
  queryType: 'upsert',
};
connectors.CRYPPTOCURRENCY_LISTINGS_LATEST = {
  db: { name: 'cryptocurrencyMetadata' },
  setParams: (params) => ({
    start: (params.start + (params?.length ?? 0)) - 1,
    interval: 3000,
    ...params,
  }),
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
};
connectors.OHLCV_V1 = {
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
};
connectors.CRYPTOCURRENCY_TRENDING_LATEST = {
  db: { name: 'searchRank' },
  query(apiData) {
    return {
      create: {
        cryptoId: apiData.id,
      },
      update: {
        cryptoId: apiData.id,
      },
      where: {
        searchRankId: apiData.key,
      },
    };
  },
  queryType: 'upsert',
};
connectors.CRYPTOCURRENCY_MOST_VIISTED = {
  db: { name: 'pageTrafficRank' },
  query(apiData) {
    return {
      create: {
        cryptoId: apiData.id,
      },
      update: {
        cryptoId: apiData.id,
      },
      where: {
        pageTrafficRankId: apiData.key,
      },
    };
  },
  queryType: 'upsert',
};
connectors.OHLCV_LATEST_V2 = {
  db: { name: 'OHLCV' },
  query: async (apiData) => {
    const { id: cryptoId } = await prisma.cryptocurrency.findUnique({
      select: {
        id: true,
      },
      where: {
        resource: {
          resourceId: apiData.id,
          providerId: 1,
        },
      },
    });

    const lastTwoOHCLV = await prisma.oHLCV.findMany({
      select: {
        closeTime: true,
      },
      where: {
        cryptoId,
      },
      take: 2,
      orderBy: { createdAt: 'desc' },
    });

    const prevOhclv = lastTwoOHCLV[1] ?? null;

    return {
      data: {
        openPrice: apiData.quote.USD.open,
        closePrice: apiData.quote.USD.close,
        highPrice: apiData.quote.USD.high,
        lowPrice: apiData.quote.USD.low,
        tradedVolume: apiData.quote.USD.volume,
        openTime: apiData.time_open,
        closeTime: apiData.time_close ?? prevOhclv,
        highTime: apiData.time_high,
        lowTime: apiData.time_low,
        resourceLastUpdatedTime: apiData.last_updated,
        cryptocurrency: {
          connect: {
            id: cryptoId,
          },
        },
      },
    };
  },
  queryType: 'create',
};

module.exports = connectors;
