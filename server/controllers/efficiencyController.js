let sql = require('mssql');
require("dotenv").config();

let sequelize = require('../config/index');
let config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: '10.0.1.130\\E2SQLSERVER',
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true,
    }
};

async function getSingleJob(req, res) {
    let JobNo = req.body.JobNo;

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT JobNo, PartNo, StepNo, WorkCntr, ActualStartDate, TotEstHrs, TotActHrs, Status\
            FROM OrderRouting\
            WHERE JobNo='153343'",

        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            res.send(records)
        })
    })
};

async function getJobRange(req, res) {
    let StartJobNo = req.body.StartJobNo;
    let FinishJobNo = req.body.FinishJobNo;

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT JobNo, PartNo, StepNo, WorkCntr, ActualStartDate, TotEstHrs, TotActHrs, Status\
            FROM OrderRouting\
            WHERE JobNo='152991'",
        
        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            res.send(records)
        })
    })
};

module.exports = {
    getSingleJob,
    getJobRange,
}