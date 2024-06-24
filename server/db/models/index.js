import { readdirSync } from "fs";
import { basename as _basename, join } from "path";
import Sequelize, { DataTypes } from "sequelize";
import { env as _env } from "process";
import config from "../config/config.cjs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(import.meta.url);
const env = _env.NODE_ENV || "development";
const configDb = config[env];
const db = {};

const sequelize = new Sequelize(configDb.url, config[env]);

(async () => {
  for (const file of readdirSync(__dirname)) {
    if (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    ) {
      const moduleUrl = new URL(file, import.meta.url);
      const model = await import(moduleUrl);
      db[model.default.name] = model.default(sequelize, DataTypes);
    }
  }
})();

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
