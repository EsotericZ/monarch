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

        request.query("SELECT CustCode, CustName, Active, SalesID, Website, BCity, BState, BZIPCode, Phone, WorkCode FROM CustCode",
        
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
        .query('SELECT CustCode, CustName, Active, SalesID, Website, BCity, BState, BZIPCode, Phone, WorkCode FROM CustCode WHERE CustCode = @custCode', function(err, result) {
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