const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/index');

class Scales extends Model {}

Scales.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
        },
        portNo: {
            type: DataTypes.INTEGER,
        },
        rack: {
            type: DataTypes.INTEGER,
        },
    }, {
        sequelize,
        tableName: 'scales',
        modelName: 'Scales',
    }
);

module.exports = Scales;