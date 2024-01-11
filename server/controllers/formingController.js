// const { Op } = require("sequelize");
const { Jobs } = require('../models');
// let sql = require('mssql');
// require("dotenv").config();

let sequelize = require('../config/index');
// let config = {
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     server: '10.0.1.130\\E2SQLSERVER',
//     database: process.env.DB_NAME,
//     options: {
//         trustServerCertificate: true,
//     }
// };

function updateJob(req, res) {
    let jobNo = req.body.jobNo;
    let formProgrammer = req.body.formProgrammer;
    let formStatus = req.body.formStatus;
    let jobStatus

    if (formStatus == 'DONE') {
        jobStatus = 'FINALIZE'
    } else {
        jobStatus = 'FORMING'
    }
    console.log(jobNo, formProgrammer, formStatus, jobStatus)
    
    let sql = `UPDATE jobs SET formProgrammer='${formProgrammer}', formStatus='${formStatus}', jobStatus='${jobStatus}' WHERE jobNo='${jobNo}'`;
    sequelize.query(sql, function(err, result) {
        return res.status(200).json({
            status: 'success',
            response: result
        })
    })
};

exports.updateJob = updateJob;