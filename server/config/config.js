const dotenv = require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
  test: {
    use_env_variable: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
};
