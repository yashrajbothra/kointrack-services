const prisma = require('../db');

const baseService = '';

const addGlobalMetricsLatest = async () => {
  const cryptocurrency = await prisma.globalMetrics.create({
    data: allMetrics,
  });

  if (platform) {
    platform.cryptoId = cryptocurrency.id;
    cryptocurrency.platform = await prisma.platform.create({ data: platform });
  }

  if (cryptocurrencymetadata) {
    cryptocurrencymetadata.cryptoId = cryptocurrency.id;
    cryptocurrency.cryptocurrencymetadata = await prisma.cryptocurrencyMetadata
      .create({ data: cryptocurrencymetadata });
  }

  return cryptocurrency;
};

module.exports = {
  addGlobalMetrics,
};
