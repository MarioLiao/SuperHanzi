import dotenv from "dotenv";

export const development = {
  url: process.env.DB_URL,
  dialect: postgres,
};
export const test = {
  url: process.env.DB_URL,
  dialect: postgres,
};
export const production = {
  url: process.env.DB_URL,
  dialect: postgres,
};
