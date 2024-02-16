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
        formProgrammer: {
            type: DataTypes.STRING,
        },
        formStatus: {
            type: DataTypes.STRING,
        },
        inspector: {
            type: DataTypes.STRING,
        },
        qcNotes: {
            type: DataTypes.STRING,
        },
        notes: {
            type: DataTypes.STRING,
        },
        model: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0,
        },
        expedite: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0,
        },
        createdAt : {
            type: DataTypes.DATE,
        },
        updatedAt : {
            type: DataTypes.DATE,
            defaultValue: null,
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        modelName: 'jobs',
    }
);

module.exports = Jobs;