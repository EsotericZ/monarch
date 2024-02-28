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
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT E.DrawNum, R.Descrip, R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, D.User_Number1, R.OrderNo, R.StepNo, D.QuoteNo, M.SubPartNo\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo INNER JOIN Estim E ON D.PartNo=E.PartNo INNER JOIN Materials M ON D.PartNo=M.PartNo\
            WHERE D.Status='Open' AND R.Status='Current' AND R.WorkCntr='204 BRAKE' AND D.User_Text2='3. WIP'\
            ORDER BY D.User_Number1 DESC, R.JobNo", 
            
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
    let formProgrammer = req.body.formProgrammer;
    let formStatus = req.body.formStatus;
    let notes = req.body.notes;
    let jobStatus

    if (formStatus == 'DONE') {
        jobStatus = 'FINALIZE'
    } else {
        jobStatus = 'FORMING'
    }
    
    let sql = `UPDATE jobs SET formProgrammer='${formProgrammer}', formStatus='${formStatus}', jobStatus='${jobStatus}', notes='${notes}' WHERE jobNo='${jobNo}'`;
    sequelize.query(sql, function(err, result) {
        return res.status(200).json({
            status: 'success',
            response: result
        })
    })
};

function updateFormProgrammer(req, res) {
    let jobNo = req.body.jobNo;
    let formProgrammer = req.body.formProgrammer;
    let sql = `UPDATE jobs SET formProgrammer='${formProgrammer}' WHERE jobNo='${jobNo}'`;
    sequelize.query(sql, function(err, result) {
        return res.status(200).json({
            status: 'success',
            response: result
        })
    })
    res.send(formProgrammer)
};

function updateFormStatus(req, res) {
    let jobNo = req.body.jobNo;
    let formStatus = req.body.formStatus;
    let jobStatus

    if (formStatus == 'DONE') {
        jobStatus = 'FINALIZE'
    } else {
        jobStatus = 'FORMING'
    }

    let sql = `UPDATE jobs SET formStatus='${formStatus}', jobStatus='${jobStatus}' WHERE jobNo='${jobNo}'`;
    sequelize.query(sql, function(err, result) {
        return res.status(200).json({
            status: 'success',
            response: result
        })
    })
    res.send(formStatus)
};

module.exports = {
    getAllJobs,
    updateJob,
    updateFormProgrammer,
    updateFormStatus,
}