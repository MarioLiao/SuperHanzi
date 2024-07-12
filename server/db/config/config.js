import dotenv from "dotenv";

dotenv.config();

const config = {
  development: {
    url: process.env.DB_URL,
    dialect: "postgres",
    logging: false,
  },
  test: {
    url: process.env.DB_URL,
    dialect: "postgres",
    logging: false,
  },
  production: {
    url: process.env.DB_URL,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

export default config;
