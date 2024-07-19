import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Payment extends Model {
    static associate(models) {
      // Define association here
      Payment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      paymentId: {
        type: DataTypes.STRING,
        unique: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Payment',
    }
  );

  return Payment;
};
