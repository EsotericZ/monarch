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

async function getAllJobs(req, res, jobData) {
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED'", 
        
        function(err, recordset) {
            if (err) console.error(err);
            let test = recordset.recordsets[0];

            const map = new Map();
            test.forEach(item => map.set(item.JobNo, item));
            jobData.forEach(item => map.set(item.jobNo, {...map.get(item.jobNo), ...item}));
            const fullJob = Array.from(map.values());

            res.send(fullJob)
        })
    })
}

async function updateJob(req, res) {
    console.log(req.body)
}

exports.getAllJobs = getAllJobs;
exports.updateJob = updateJob;