import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Character extends Model {
    static associate(models) {
      //Character.belongsToMany(models.User, { foreignKey: "userId", as: "user" });
      //implement for the characters that are already learned feature or something else
    }
  }

  Character.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      character: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pinyin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      english: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Character',
    }
  );
  return Character;
};
