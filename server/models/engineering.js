let sql = require('mssql');
const dotenv = require('dotenv');

require("dotenv").config();

let config = {
    user: process.env.DB_USER,
    password: 'Mon@rch09',
    server: '10.0.1.130\\E2SQLSERVER',
    database: 'MONARCH_SHOP',
    options: {
        trustServerCertificate: true,
    }
};

async function getJobs(req, res) {
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT TOP 5 PartNo, WorkCntr FROM OrderRouting WHERE WorkCntr='211 TLASER'", function(err, recordset) {
            if (err) console.error(err);
            res.send(recordset)
        })
    })    
}

exports.getJobs = getJobs;