const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config');

class Jobs extends Model {}

Jobs.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
        },
        jobNo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        engineer: {
            type: DataTypes.STRING,
        },
        jobStatus: {
            type: DataTypes.STRING,
        },
        // wip: {
        //     type: DataTypes.BOOLEAN,
        // },
        // hold: {
        //     type: DataTypes.BOOLEAN,
        // },
        // holdNotes: {
        //     type: DataTypes.STRING,
        // },
        // qc: {
        //     type: DataTypes.BOOLEAN,
        // },
        // qcNotes: {
        //     type: DataTypes.STRING,
        // },
        // approved: {
        //     type: DataTypes.BOOLEAN,
        // }
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        modelName: 'jobs',
    }
);

module.exports = Jobs;