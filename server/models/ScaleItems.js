const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config');

class ScaleItems extends Model {}

ScaleItems.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        scaleId: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        itemName: {
            type: DataTypes.STRING,
        },
        itemLocation: {
            type: DataTypes.STRING,
        },
        alert: {
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        modelName: 'scaleitems',
    }
);

module.exports = ScaleItems;