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

async function getTest(req, res) {
    let jobNo = req.params.jobno;
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        //change to BOM toget J.PartNo/J.StepNo
        request.query(`SELECT R.JobNo, O.CustCode, R.PartNo, J.PartNo, J.StepNo, R.EstimQty, D.QtyOrdered, R.StepNo, R.WorkCntr, R.ActualEndDate, R.Status \
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo INNER JOIN JobReq J ON R.JobNo = J.JobNo \
            WHERE R.JobNo='${jobNo}'`, 
        
        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];
            
            // console.log(records)
            res.json(records)
        })
    })
};

module.exports = {
    getTest,
}

// request.query(`SELECT R.JobNo, O.CustCode, R.PartNo, J.PartNo, J.StepNo, R.EstimQty, D.QtyOrdered, R.StepNo, R.WorkCntr, R.ActualEndDate, R.Status \
// FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo INNER JOIN JobReq J ON R.JobNo = J.JobNo \
// WHERE R.JobNo='${jobNo}'`,  
// request.query(`SELECT PartNo, StepNo  \
//             FROM JobReq  \
//             WHERE JobNo='${jobNo}'`,  