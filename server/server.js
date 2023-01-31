let express = require('express');
let sql = require('mssql');
let app = express();

// let config = {
//     user: 'sa',
//     password: 'Mon@rch09',
//     server: '10.0.1.130\\E2SQLSERVER',
//     database: 'MONARCH_SHOP',
//     // port: 1433
//     options: {
//         trustServerCertificate: true,
//     }
// };

// (async function() {
//     try {
//         let pool = await sql.connect(config)
//         console.log('Connection established')
//     } catch (err) {
//         console.error(err)
//     }
// }

// function connect() {
//     let dbConn = new sql.ConnectionPool(config);
//     dbConn.connect()
//     // console.log('Connection established')
//     .then(function () {
//         let request = new sql.Request(dbConn);
//         request.query("select * from OrderRouting").then(function (recordSet) {
//             console.log(recordSet);
//             dbConn.close();
//         }).catch(function (err) {
//             console.log(err);
//             dbConn.close();
//         });
//     }).catch(function (err) {
//         console.log(err);
//     });
// }
// connect();

app.get('/', function(req, res) {
    let config = {
        user: 'sa',
        password: 'Mon@rch09',
        server: '10.0.1.130\\E2SQLSERVER',
        database: 'MONARCH_SHOP',
        options: {
            trustServerCertificate: true,
        }
    };

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT * FROM OrderRouting WHERE WorkCntr='211 TLASER'", function(err, recordset) {
            if (err) console.error(err);

            res.send(recordset)
        });
    });
});

let server = app.listen(5000, function() {
    console.log('Server  is running')
});