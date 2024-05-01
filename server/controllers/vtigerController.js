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

        request.query("SELECT * FROM CustCode WHERE Active='Y'",
        
        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            res.send(records)
        })
    })
};

async function getOneCustomer(req, res) {
    let custCode = req.body.custCode;
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

async function getAllContacts(req, res) {
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT * FROM CustCode AS CC JOIN Contacts AS C ON CC.CustCode = C.Code WHERE CC.Active = 'Y'",
        
        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            res.send(records)
        })
    })
};

async function getOneContact(req, res) {
    let custCode = req.body.custCode;
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.input('custCode', sql.NVarChar, custCode)
        .query('SELECT * FROM CustCode AS CC JOIN Contacts AS C ON CC.CustCode = C.Code WHERE C.Code = @custCode', function(err, result) {
            if (err) console.error(err);
            let records = result.recordsets[0];

            res.send(records)            
        });
    })
};

async function getAllQuotes(req, res) {
    sql.connect(config, function(err) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("\
            SELECT Q.CustDesc, Q.CustCode, Q.QuoteNo, SUM(QD.Price1) AS TotalAmount, Q.DateEnt, Q.FollowUpDate, Q.ExpireDate, Q.QuotedBy \
            FROM Quote AS Q JOIN QuoteDet AS QD ON Q.QuoteNo = QD.QuoteNo \
            WHERE Q.User_Text4='ESTIMATED' \
            GROUP BY Q.CustDesc, Q.CustCode, Q.QuoteNo, Q.DateEnt, Q.FollowUpDate, Q.ExpireDate, Q.QuotedBy",
        
        function(err, recordset) {
            if (err) console.error(err);

            res.send(recordset.recordsets[0]);
        })
    })
};

module.exports = {
    getAllCustomers,
    getOneCustomer,
    getAllContacts,
    getOneContact,
    getAllQuotes,
}