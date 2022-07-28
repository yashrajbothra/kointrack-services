const { PrismaClient } = require('@prisma/client');

if (process.env.NODE_ENV === 'test') {
  module.exports = new PrismaClient({
    datasources: { db: { url: 'postgres://postgres:kointrack@localhost:5432/test_kointrack' } },
  });
} else {
  module.exports = new PrismaClient();
}
