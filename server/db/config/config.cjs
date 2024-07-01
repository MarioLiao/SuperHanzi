require("dotenv").config();

const config = {
  development: {
    url: process.env.DB_URL,
    dialect: "postgres",
  },
  test: {
    url: process.env.DB_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    url: process.env.DB_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

module.exports = config;
