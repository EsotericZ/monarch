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

        request.query(`SELECT JobNo, PartNo, StepNo, WorkCntr, ActualStartDate, TotEstHrs, TotActHrs, Status\
            FROM OrderRouting\
            WHERE JobNo='${JobNo}'`,

        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];
            console.log(records)

            res.send(records)
        })
    })
};

async function getJobRange(req, res) {
    const StartJobNo = req.body.StartJobNo;
    const FinishJobNo = req.body.FinishJobNo;


    await sql.connect(config);
    const request = new sql.Request();

    const query = `
        SELECT JobNo, PartNo, StepNo, WorkCntr, ActualStartDate, TotEstHrs, TotActHrs, Status
        FROM OrderRouting
        WHERE JobNo >= @StartJobNo AND JobNo <= @FinishJobNo`;

    request.input('StartJobNo', sql.VarChar, StartJobNo);
    request.input('FinishJobNo', sql.VarChar, FinishJobNo);

    const result = await request.query(query);

    res.status(200).json(result.recordset);
};

module.exports = {
    getSingleJob,
    getJobRange,
}