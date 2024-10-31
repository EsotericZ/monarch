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

async function getAllPOsDate(req, res) {
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    console.log(startDate, endDate)

    sql.connect(config, function (err,) {
        if (err) console.error(err);
        let request = new sql.Request();
        
        request.input('startDate', sql.NVarChar, startDate)
        .input('endDate', sql.NVarChar, endDate)
        .query(`
            SELECT 
                POReleases.PONum AS "PONo",
                POReleases.JobNo AS "JobNo",
                MAX(OrderDet.PartNo) AS "PartNo",
                SUM(COALESCE(CAST(JobReq.PurchQty AS DECIMAL(10, 2)), 0)) AS "EstimatedSQFTJob",
                POReleases.Qty AS "ActualSQFTJob",

                PODet.QtyOrd AS "TotalSQFTPO",

                PODet.PartNo AS "Material",
                PODet.PartDesc AS "MaterialDescription",
                PODet.DueDate,
                PODet.Status,
                PODet.ProdCode,
                PODet.GLCode

                
            FROM POReleases
            LEFT JOIN PODet ON POReleases.PONum = PODet.PONum
            LEFT JOIN OrderDet ON POReleases.JobNo = OrderDet.JobNo
            LEFT JOIN JobReq ON POReleases.JobNo = JobReq.JobNo AND PODet.PartNo = JobReq.PartNo

            WHERE PODet.GLCode = '5010-20'
            AND PODet.DueDate BETWEEN @startDate AND @endDate

            GROUP BY 
                POReleases.PONum, 
                POReleases.JobNo, 
                POReleases.Qty, 
                PODet.PartNo, 
                PODet.PartDesc, 
                PODet.QtyOrd, 
                PODet.DueDate, 
                PODet.Status,
                PODet.ProdCode,
                PODet.GLCode;
            `, 

            function (err, recordset) {
                if (err) console.error(err);
                let records = recordset.recordsets[0];

                res.send(records)
            })
    })
}

async function getAllPOsPO(req, res) {
    let poNum = req.body.poNum;

    sql.connect(config, function (err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.input('poNum', sql.NVarChar, poNum)
        .query(`
            SELECT 
                POReleases.PONum AS "PONo",
                POReleases.JobNo AS "JobNo",
                MAX(OrderDet.PartNo) AS "PartNo",
                SUM(COALESCE(CAST(JobReq.PurchQty AS DECIMAL(10, 2)), 0)) AS "EstimatedSQFTJob",
                POReleases.Qty AS "ActualSQFTJob",

                PODet.QtyOrd AS "TotalSQFTPO",

                PODet.PartNo AS "Material",
                PODet.PartDesc AS "MaterialDescription",
                PODet.DueDate,
                PODet.Status,
                PODet.ProdCode,
                PODet.GLCode

                
            FROM POReleases
            LEFT JOIN PODet ON POReleases.PONum = PODet.PONum
            LEFT JOIN OrderDet ON POReleases.JobNo = OrderDet.JobNo
            LEFT JOIN JobReq ON POReleases.JobNo = JobReq.JobNo AND PODet.PartNo = JobReq.PartNo

            WHERE PODet.GLCode = '5010-20'
            AND POReleases.PONum = @poNum

            GROUP BY 
                POReleases.PONum, 
                POReleases.JobNo, 
                POReleases.Qty, 
                PODet.PartNo, 
                PODet.PartDesc, 
                PODet.QtyOrd, 
                PODet.DueDate, 
                PODet.Status,
                PODet.ProdCode,
                PODet.GLCode;
            `, 

            function (err, recordset) {
                if (err) console.error(err);
                let records = recordset.recordsets[0];

                res.send(records)
            })
    })
}

module.exports = {
    getAllPOsDate,
    getAllPOsPO,
}