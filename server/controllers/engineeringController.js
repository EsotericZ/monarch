const { Op } = require("sequelize");
const { Jobs } = require('../models');
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
    const jobData = await Jobs.findAll();
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED'\
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
    const jobData = await Jobs.findAll();
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED'\
            ORDER BY D.User_Number3", 
        
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

async function getFRJobs(req, res) {
    const jobData = await Jobs.findAll();
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED'\
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

async function updateModel(req, res) {
    let id = req.body.id

    await Jobs.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.model) {
            Jobs.update(
                { model: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            Jobs.update(
                { model: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

exports.getAllJobs = getAllJobs;
exports.getTBRJobs = getTBRJobs;
exports.getFRJobs = getFRJobs;
exports.updateJob = updateJob;
exports.updateModel = updateModel;