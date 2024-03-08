const { Op } = require("sequelize");
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

async function getAllCustomers(req, res) {
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        // request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode\
        //     FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
        //     WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED'\
        //     ORDER BY R.JobNo", 
        request.query("SELECT Active, CustCode FROM CustCode WHERE CustCode='3DSYS'",
        
        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            res.send(records)
        })
    })
};

async function getOneCustomer(req, res) {
    let custCode = req.body.custCode;
    console.log(custCode)
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.input('custCode', sql.NVarChar, custCode)
        .query('SELECT * FROM CustCode WHERE CustCode = @custCode', function(err, result) {
            if (err) console.error(err);
            let records = result.recordsets[0];

            res.send(records)            
        });
    })
};

module.exports = {
    getAllCustomers,
    getOneCustomer,
}