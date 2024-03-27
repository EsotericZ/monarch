const { Op } = require("sequelize");
const { TLJobs } = require('../models');
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

async function getAllJobs(req, res) {
    const jobData = await TLJobs.findAll();
    console.log(jobData)
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, M.SubPartNo, D.User_Date1\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo INNER JOIN Estim E ON D.PartNo=E.PartNo INNER JOIN Materials M ON D.PartNo=M.PartNo\
            WHERE D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND R.WorkCntr='301 SAW' AND R.JobNo\
            IN (SELECT R.JobNo FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo WHERE D.Status='Open' AND R.Status='Finished')\
            ORDER BY R.JobNo", 
            
        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            const map = new Map();
            records.forEach(item => map.set(item.JobNo, item));
            jobData.forEach(item => map.set(item.jobNo, {...map.get(item.jobNo), ...item}));
            const fullJob = Array.from(map.values());

            res.send(fullJob)
        })
    })
};

async function getTBRJobs(req, res) {
    const jobData = await TLJobs.findAll();
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, M.SubPartNo, D.User_Date1\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo INNER JOIN Estim E ON D.PartNo=E.PartNo INNER JOIN Materials M ON D.PartNo=M.PartNo\
            WHERE D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND R.WorkCntr='301 SAW' AND D.User_Text2='2. TBR' AND R.JobNo\
            IN (SELECT R.JobNo FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo WHERE D.Status='Open' AND R.Status='Finished')\
            ORDER BY D.User_Number3", 
            
        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];
            console.log(records)
            
            const map = new Map();
            records.forEach(item => map.set(item.JobNo, item));
            jobData.forEach(item => map.set(item.jobNo, {...map.get(item.jobNo), ...item}));
            const fullJob = Array.from(map.values());

            res.send(fullJob)
        })
    })
};

async function getFRJobs(req, res) {
    const jobData = await TLJobs.findAll();
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, M.SubPartNo, D.User_Date1\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo INNER JOIN Estim E ON D.PartNo=E.PartNo INNER JOIN Materials M ON D.PartNo=M.PartNo\
            WHERE D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND R.WorkCntr='301 SAW' AND (D.User_Text2 = '1. OFFICE' OR D.User_Text2 = '3. WIP') AND R.JobNo\
            IN (SELECT R.JobNo FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo WHERE D.Status='Open' AND R.Status='Finished')\
            ORDER BY D.DueDate, R.JobNo", 
            
        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            const map = new Map();
            records.forEach(item => map.set(item.JobNo, item));
            jobData.forEach(item => map.set(item.jobNo, {...map.get(item.jobNo), ...item}));
            const fullJob = Array.from(map.values());

            res.send(fullJob)
        })
    })
};

function updateJob(req, res) {
    let jobNo = req.body.jobNo;
    let engineer = req.body.engineer;
    let jobStatus = req.body.jobStatus;
    let sql = `UPDATE jobs SET engineer='${engineer}', jobStatus='${jobStatus}' WHERE jobNo='${jobNo}'`;
    sequelize.query(sql, function(err, result) {
        return res.status(200).json({
            status: 'success',
            response: result
        })
    })
};

module.exports = {
    getAllJobs,
    getTBRJobs,
    getFRJobs,
    updateJob,
}