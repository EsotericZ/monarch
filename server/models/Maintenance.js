const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config');

class Maintenance extends Model {}

Maintenance.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
        },
        record: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },

    }, {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        modelName: 'maintenance',
    }
);

module.exports = Maintenance;