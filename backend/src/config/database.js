const { Sequelize } = require('sequelize');
const url = require('url');
const dotenv = require('dotenv');

dotenv.config();

const parseDatabaseUrl = (connectionString) => {
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const parsed = new url.URL(connectionString);
  return {
    username: parsed.username,
    password: parsed.password,
    database: parsed.pathname.replace('/', ''),
    host: parsed.hostname,
    port: parsed.port || 5432,
    dialect: 'postgres'
  };
};

const config = parseDatabaseUrl(process.env.DATABASE_URL);

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true
  }
});

module.exports = {
  sequelize,
  config
};
