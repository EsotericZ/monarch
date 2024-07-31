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

    const currentDate = new Date();
    const firstDayOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    firstDayOfNextMonth.setUTCHours(0, 0, 0, 0);

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode, R.WorkCntr, D.MasterJobNo, O.Status\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE (D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND R.Status='Current') OR (O.Status='O' AND D.MasterJobNo!='' AND D.User_Text2='4. DONE' AND R.StepNo=10)\
            ORDER BY D.DueDate, R.JobNo", 

        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            const filteredRecords = records.filter(record => new Date(record.DueDate) < firstDayOfNextMonth);

            res.send(filteredRecords)
        })
    })
};

async function getAllSubJobs(req, res) {
    const JobNo = req.body.JobNo;

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query(`SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode, R.WorkCntr, D.MasterJobNo, O.Status\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE (D.MasterJobNo=${JobNo} AND R.Status='Current') OR (D.MasterJobNo=${JobNo} AND R.StepNo=10 AND D.User_Text2='4. DONE')\
            ORDER BY R.JobNo`, 

        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            res.send(records)
        })
    })
}

module.exports = {
    getAllJobs,
    getAllSubJobs,
}