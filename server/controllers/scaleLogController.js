const { Op, literal } = require("sequelize");
const { Jobs } = require('../models');
let sql = require('mssql');

async function addNewScaleLog(req, res) {
    const log = req.body.log;
    console.log(log)
};

module.exports = {
    addNewScaleLog,
}