const slugify = require('slugify');

module.exports = (name) => slugify(name, { replacement: '-', lower: true });
