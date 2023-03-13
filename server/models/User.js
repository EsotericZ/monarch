const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/index');

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
    }, {
        sequelize,
        tableName: 'users',
        modelName: 'User',
    }
);

module.exports = User;