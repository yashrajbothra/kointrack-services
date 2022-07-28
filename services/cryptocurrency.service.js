/* eslint-disable no-param-reassign */
const slugger = require('../utils/slugger');
const prisma = require('../db');

const addCryptocurrency = async ({
  name, symbol, status, sign, cryptocurrencymetadata, platform,
}) => {
  const slug = slugger(name);

  const cryptocurrency = await prisma.cryptocurrency.create({
    data: {
      name,
      symbol,
      slug,
      sign,
      status,
    },
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

const addCryptocurrencyPlatform = async ({
  cryptoId, parentCryptoId, tokenAddress,
}) => {
  const cryptoMetaData = await prisma.cryptocurrencyMetadata.create({
    data: {
      cryptocurrency: { connect: cryptoId },
      parentCryptoId,
      tokenAddress,
    },
  });
  return cryptoMetaData;
};

/**
 * @param {Object} cryptocurrencyMetadata
 * @param {Number} cryptocurrencyMetadata.cryptoId
 * @param {String} cryptocurrencyMetadata.logoUrl
 * @param {String} cryptocurrencyMetadata.description
 * @param {Number} cryptocurrencyMetadata.categoryId
 * @param {Object} cryptocurrencyMetadata.urls
 * @param {String} cryptocurrencyMetadata.notice
 * @param {Object} cryptocurrencyMetadata.tags
 * @param {Number} cryptocurrencyMetadata.selfReportedCirculatingSupply
 * @param {Number} cryptocurrencyMetadata.selfReportedMarketCap
 * @param {Object} cryptocurrencyMetadata.selfReportedTags
 * @return {Object}
 */
const addCryptocurrencyMetadata = async ({
  cryptoId, logoUrl, description, category, urls, notice, tags, contractAddresses,
  selfReportedCirculatingSupply, selfReportedMarketCap, selfReportedTags, dateAdded, dateLaunched,
}) => {
  const cryptoMetaData = await prisma.cryptocurrencyMetadata.create({
    data: {
      cryptocurrency: { connect: { id: cryptoId } },
      logoUrl,
      description,
      category: { create: category },
      urls: { create: urls },
      contractAddress: { create: contractAddresses },
      TagsOnCryptocurrencyMetadatas: { connect: tags },
      notice,
      selfReportedCirculatingSupply,
      selfReportedMarketCap,
      selfReportedTags,
      dateAdded,
      dateLaunched,
    },
  });
  return cryptoMetaData;
};

// TODO create a algo for generating slugs
// TODO create a helper to find cryptoId by slug/symbol/id
// WIP
const addUrls = async ({
  website,
  technicalDocumentation,
  explorer,
  sourceCode,
  messageBoard,
  chat,
  announcement,
  reddit,
  twitter,
  telegram,
}) => {
  const urlsData = await prisma.urls.create({
    data: {
      website,
      technicalDocumentation,
      explorer,
      sourceCode,
      messageBoard,
      chat,
      announcement,
      reddit,
      twitter,
      telegram,
    },
  });

  return urlsData;
};

const updateUrls = async ({
  urlsId,
  website,
  technicalDocumentation,
  explorer,
  sourceCode,
  messageBoard,
  chat,
  announcement,
  reddit,
  twitter,
  telegram,
}) => {
  const urlsData = await prisma.urls.update({
    data: {
      website,
      technicalDocumentation,
      explorer,
      sourceCode,
      messageBoard,
      chat,
      announcement,
      reddit,
      twitter,
      telegram,
    },
    where: {
      urlsId,
    },
  });

  return urlsData;
};

// WIP
const addMarketInfo = async ({
  circulatingSupply,
  totalSupply,
  maxSupply,
  marketCap,
  cryptocurrency,
}) => {
  const marketInfo = await prisma.marketData.create({
    data: {
      circulatingSupply,
      totalSupply,
      marketCap,
      maxSupply,
      cryptocurrency: {
        connectOrCreate: {
          create: cryptocurrency, where: { slug: cryptocurrency.slug },
        },
      },
    },
  });
  return marketInfo;
};

// WIP
const addCryptoCategory = async ({ name }) => {
  const slug = slugger(name);
  // TODO Create a unique slug if slug is duplicate
  const category = await prisma.category.create({
    data: {
      name,
      slug,
    },
  });

  return category;
};

const addTagsGroup = async ({ name }) => {
  const tagsGroup = await prisma.tagsGroup.create({
    data: {
      name,
    },
  });

  return tagsGroup;
};

const addCryptoTags = async ({ name }) => {
  const cryptoTags = await prisma.tags.create({
    data: {
      name,
    },
  });
  return cryptoTags;
};

const addCryptocurrencyOHLCV = async ({
  cryptoId, openPrice, highPrice, lowPrice, closePrice, tradedVolume, createdAt,
}) => {
  const cryptoOHLCV = await prisma.oHLCV.create({
    data: {
      cryptocurrency: { connect: { id: cryptoId } },
      openPrice,
      highPrice,
      lowPrice,
      closePrice,
      tradedVolume,
      createdAt,
    },
  });
  return cryptoOHLCV;
};

const updateCryptocurrencyMetadata = async ({
  cryptoId, logoUrl, description, category, notice,
  selfReportedCirculatingSupply, selfReportedMarketCap, selfReportedTags,
}) => {
  const cryptoMetaData = await prisma.cryptocurrencyMetadata.update({
    data: {
      logoUrl,
      description,
      category: { connect: category },
      notice,
      selfReportedCirculatingSupply,
      selfReportedMarketCap,
      selfReportedTags,
    },
    where: {
      cryptoId,
    },
  });
  return cryptoMetaData;
};

const updateCryptocurrencyStatus = async ({
  cryptoId, status,
}) => {
  const cryptoTags = await prisma.cryptocurrency.update({
    data: {
      status,
    },
    where: {
      id: cryptoId,
    },
  });
  return cryptoTags;
};

module.exports = {
  addUrls,
  addMarketInfo,
  addCryptoCategory,
  addTagsGroup,
  addCryptoTags,
  addCryptocurrency,
  addCryptocurrencyMetadata,
  addCryptocurrencyOHLCV,
  addCryptocurrencyPlatform,
  updateCryptocurrencyStatus,
  updateCryptocurrencyMetadata,
  updateUrls,
};
