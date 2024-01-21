const { Op } = require("sequelize");
const { Jobs } = require('../models');
let sql = require('mssql');
require("dotenv").config();

let sequelize = require('../config/index');

function updateInspector(req, res) {
    let jobNo = req.body.jobNo;
    let inspector = req.body.inspector;
    console.log(jobNo, inspector)
    let sql = `UPDATE jobs SET inspector='${inspector}' WHERE jobNo='${jobNo}'`;
    sequelize.query(sql, function(err, result) {
        return res.status(200).json({
            status: 'success',
            response: result
        })
    })
};

function updateStatus(req, res) {
    let jobNo = req.body.jobNo;
    let jobStatus = req.body.jobStatus;
    let sql = `UPDATE jobs SET jobStatus='${jobStatus}' WHERE jobNo='${jobNo}'`;
    sequelize.query(sql, function(err, result) {
        return res.status(200).json({
            status: 'success',
            response: result
        })
    })
};

module.exports = {
    updateInspector,
    updateStatus,
}