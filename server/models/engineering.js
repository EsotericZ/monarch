let sql = require('mssql');
require("dotenv").config();

let config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERV,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true,
    }
};

async function getAllJobs(req, res) {
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT TOP 5 PartNo, WorkCntr FROM OrderRouting WHERE WorkCntr='211 TLASER'", function(err, recordset) {
            if (err) console.error(err);
            res.send(recordset)
        })
    })    
}

exports.getAllJobs = getAllJobs;