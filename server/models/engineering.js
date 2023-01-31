let sql = require('mssql');
const dotenv = require('dotenv');
let axios = require('axios');

let config = {
    user: 'sa',
    password: 'Mon@rch09',
    server: '10.0.1.130\\E2SQLSERVER',
    database: 'MONARCH_SHOP',
    options: {
        trustServerCertificate: true,
    }
};

async function getJobs(req, res) {
    let dbConn = new sql.ConnectionPool(config);
    dbConn.connect()
    // console.log('Connection established')
    .then(function () {
        let request = new sql.Request(dbConn);
        request.query("select * from OrderRouting").then(function (recordSet) {
            console.log(recordSet);
            dbConn.close();
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });
}

exports.getJobs = getJobs;