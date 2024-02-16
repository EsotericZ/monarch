const { Op } = require("sequelize");
const { Jobs } = require('../models');
let sql = require('mssql');
require("dotenv").config();

let sequelize = require('../config/index');

function updateInspector(req, res) {
    let jobNo = req.body.jobNo;
    let inspector = req.body.inspector;
    let sql = `UPDATE jobs SET inspector='${inspector}' WHERE jobNo='${jobNo}'`;
    sequelize.query(sql, function(err, result) {
        return res.status(200).json({
            status: 'success',
            response: result
        })
    })
    res.send(inspector)
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
    res.send(jobStatus)
};

module.exports = {
    updateInspector,
    updateStatus,
}