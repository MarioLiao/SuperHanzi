import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import { fileURLToPath, pathToFileURL } from "url";
import configFile from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = configFile[env];
const db = {};

let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const importModel = async (file) => {
  const modulePath = pathToFileURL(path.join(__dirname, file)).href;
  const model = await import(modulePath);
  return model.default(sequelize, Sequelize.DataTypes);
};

const modelsDir = fileURLToPath(new URL(".", import.meta.url));

await Promise.all(
  fs
    .readdirSync(modelsDir)
    .filter(
      (file) =>
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".js" &&
        file.indexOf(".test.js") === -1
    )
    .map(async (file) => {
      const model = await importModel(file);
      db[model.name] = model;
    })
);

await Promise.all(
  Object.keys(db).map(async (modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  })
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
export { sequelize };
export const models = db;
