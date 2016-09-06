exports.default = {
  hostname: process.env.POSTGRES_HOST || 'db',
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'docker',
  database: process.env.POSTGRES_DB || 'zdc-api'
};


exports.test = {
  hostname: 'localhost',
  database: 'zdc-test'
};

exports.staging = {};

exports.production = {};