/* eslint-disable no-await-in-loop */
const { PrismaClient } = require('@prisma/client');
const { providers } = require('./seedData');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

async function main() {
  logger.info('CREATING...');
  for (const elem of providers) {
    await prisma.provider.create({
      data: elem,
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    logger.info('DISCONNECTING...');

    await prisma.$disconnect();
  });
