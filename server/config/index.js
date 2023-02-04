require('dotenv').config();
const Sequelize = require('sequelize');

let sequelize;

sequelize = new Sequelize(
    // process.env.SQ_NAME,
    // process.env.SQ_USER,
    // process.env.SQ_PASS,
    'monarch',
    'root',
    'password',
    {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    }
)

module.exports = sequelize;