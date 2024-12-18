const { Op, literal } = require("sequelize");
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

async function getAllJobs(req, res) {
    const jobData = await Jobs.findAll();

    const currentDate = new Date();
    const firstDayOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    firstDayOfNextMonth.setUTCHours(0, 0, 0, 0);

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode, R.WorkCntr, D.MasterJobNo, O.Status, O.OrderTotal, R.VendCode, D.UnitPrice, D.QtyOrdered, D.QtyShipped2Cust\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE (D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND R.Status='Current') OR (O.Status='O' AND D.MasterJobNo!='' AND R.StepNo=10) OR (O.Status='O' AND D.Status='Open' AND R.StepNo=10 AND D.User_Text2='4. DONE') OR (O.Status='O' AND D.Status='Open' AND D.User_Text3='' AND D.User_Text2='')\
            ORDER BY D.DueDate, R.JobNo", 

        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            const filteredRecords = records.filter(record => new Date(record.DueDate) < firstDayOfNextMonth);

            const jobDataMap = new Map();
            jobData.forEach(job => jobDataMap.set(job.jobNo, job));

            const mergedRecords = filteredRecords.map(record => {
                const job = jobDataMap.get(record.JobNo);
                return job ? { ...record, ...job } : record;
            });

            res.send(mergedRecords)
        })
    })
};

async function getNextMonthJobs(req, res) {
    const jobData = await Jobs.findAll();

    const currentDate = new Date();
    const firstDayOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    firstDayOfNextMonth.setUTCHours(0, 0, 0, 0);
    const firstDayOfFollowingMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1);
    firstDayOfFollowingMonth.setUTCHours(0, 0, 0, 0);

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode, R.WorkCntr, D.MasterJobNo, O.Status, O.OrderTotal, R.VendCode, D.UnitPrice, D.QtyOrdered, D.QtyShipped2Cust\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE (D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND R.Status='Current') OR (O.Status='O' AND D.MasterJobNo!='' AND R.StepNo=10) OR (O.Status='O' AND D.Status='Open' AND R.StepNo=10 AND D.User_Text2='4. DONE') OR (O.Status='O' AND D.Status='Open' AND D.User_Text3='' AND D.User_Text2='')\
            ORDER BY D.DueDate, R.JobNo", 

        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            const filteredRecords = records.filter(record => {
                const dueDate = new Date(record.DueDate);
                return dueDate >= firstDayOfNextMonth && dueDate < firstDayOfFollowingMonth;
            });

            const jobDataMap = new Map();
            jobData.forEach(job => jobDataMap.set(job.jobNo, job));

            const mergedRecords = filteredRecords.map(record => {
                const job = jobDataMap.get(record.JobNo);
                return job ? { ...record, ...job } : record;
            });

            res.send(mergedRecords)
        })
    })
};

async function getFutureJobs(req, res) {
    const jobData = await Jobs.findAll();

    const currentDate = new Date();
    const firstDayOfFutureMonths = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1);
    firstDayOfFutureMonths.setUTCHours(0, 0, 0, 0);

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode, R.WorkCntr, D.MasterJobNo, O.Status, O.OrderTotal, R.VendCode, D.UnitPrice, D.QtyOrdered, D.QtyShipped2Cust\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE (D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND R.Status='Current') OR (O.Status='O' AND D.MasterJobNo!='' AND R.StepNo=10) OR (O.Status='O' AND D.Status='Open' AND R.StepNo=10 AND D.User_Text2='4. DONE') OR (O.Status='O' AND D.Status='Open' AND D.User_Text3='' AND D.User_Text2='')\
            ORDER BY D.DueDate, R.JobNo", 

        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            const filteredRecords = records.filter(record => new Date(record.DueDate) >= firstDayOfFutureMonths);

            const jobDataMap = new Map();
            jobData.forEach(job => jobDataMap.set(job.jobNo, job));

            const mergedRecords = filteredRecords.map(record => {
                const job = jobDataMap.get(record.JobNo);
                return job ? { ...record, ...job } : record;
            });

            res.send(mergedRecords)
        })
    })
};

async function getAllSubJobs(req, res) {
    const JobNo = req.body.JobNo;
    const jobData = await Jobs.findAll();

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query(`SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode, R.WorkCntr, D.MasterJobNo, O.Status, D.UnitPrice, D.QtyOrdered, D.QtyShipped2Cust\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE (D.MasterJobNo=${JobNo} AND R.Status='Current') OR (D.MasterJobNo=${JobNo} AND R.StepNo=10 AND D.User_Text2='4. DONE')\
            ORDER BY R.JobNo`, 

        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            const jobDataMap = new Map();
            jobData.forEach(job => jobDataMap.set(job.jobNo, job));

            const mergedRecords = records.map(record => {
                const job = jobDataMap.get(record.JobNo);
                return job ? { ...record, ...job } : record;
            });

            res.send(mergedRecords)
        })
    })
};

async function getSingleJob(req, res) {
    const JobNo = req.body.JobNo;

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();
 
        request.query(`SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode, R.WorkCntr, D.MasterJobNo, R.Status, R.ActualEndDate, R.EmplCode, R.WorkOrVend, R.VendCode, D.UnitPrice, D.QtyOrdered, D.QtyShipped2Cust\
        FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
        WHERE D.JobNo=${JobNo}\
        ORDER BY R.StepNo`, 

        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            res.send(records)
        })
    })
};

async function updateJob(req, res) {
    let id = req.body.id
    let blnotes = req.body.blNotes
    let osvnotes = req.body.osvNotes
    let cdate = req.body.cdate
    console.log(id, blnotes, osvnotes, cdate);

    let utcDate = null;

    if (cdate != null) {
        const dateObj = new Date(`${cdate}T00:00:00Z`);
        utcDate = dateObj.toISOString().split('T')[0];
    }

    await Jobs.update(
        {
            blnotes,
            osvnotes,
            cdate: literal(utcDate !== null ? `'${utcDate}'` : null),
        },
        { where: { id: id }}
    ).then((result) => {
        return res.status(200).send({
            data: result
        })
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
};

async function updateEmail(req, res) {
    let id = req.body.id;

    await Jobs.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.email) {
            Jobs.update(
                { email: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            Jobs.update(
                { email: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
};

async function updateHold(req, res) {
    let id = req.body.id;

    await Jobs.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.hold) {
            Jobs.update(
                { hold: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            Jobs.update(
                { hold: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
};

async function Unconfirmed(req, res) {

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query("SELECT O.CustCode, D.PartNo, D.Revision, D.DueDate, D.User_Text3, D.JobNo \
            FROM ORDERS O INNER JOIN OrderDet D ON O.OrderNo=D.OrderNo\
            WHERE O.User_Text3='UNCONFIRMED'",

        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            res.send(records)
        })
    })
};

async function Test(req, res) {

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        // request.query("SELECT D.JobNo, O.CustCode, D.PartNo, D.DueDate, D.Revision, D.DueDate, D.User_Text3, D.Status, O.User_Text3, O.Status, D.User_Text2 \
        //     FROM ORDERS O INNER JOIN OrderDet D ON O.OrderNo=D.OrderNo\
        //     WHERE (O.Status='O' AND D.Status='Open' AND D.User_Text3='' AND D.User_Text2='')",
            // WHERE D.JobNo='153764'",
            // GET ALL TABLE NAMES
            // request.query(`
            //     SELECT TABLE_NAME
            //     FROM INFORMATION_SCHEMA.TABLES
            //     WHERE TABLE_TYPE = 'BASE TABLE'
            //     ORDER BY TABLE_NAME ASC
            // `,

            // request.query(`
            //     SELECT COLUMN_NAME
            //     FROM INFORMATION_SCHEMA.COLUMNS
            //     WHERE TABLE_NAME = 'PODet'
            //     ORDER BY COLUMN_NAME ASC
            // `,

            // request.query(`
            //     SELECT *
            //     FROM OrderDet
            //     WHERE PartNo = '105246'
            // `,
        
            request.query(`
                SELECT *
                FROM Materials
                WHERE PartNo = '105246'
            `,

        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            res.send(records)
        })
    })
};

async function Test2(req, res) {

    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();

        request.query(`
            SELECT 
                POReleases.PONum AS "PONo",
                POReleases.JobNo AS "JobNo",
                MAX(OrderDet.PartNo) AS "PartNo",
                MAX(OrderDet.QtyToMake) AS "JobQty",
                POReleases.Qty AS "ActualSQFTJob",
                PODet.QtyOrd AS "TotalSQFTPO",
                PODet.PartNo AS "Material",
                PODet.DueDate,
                PODet.Status,
                PODet.ProdCode,
                PODet.GLCode,
                m.Qty AS "MaterialQty"

            FROM POReleases
            LEFT JOIN PODet ON POReleases.PONum = PODet.PONum
            LEFT JOIN OrderDet ON POReleases.JobNo = OrderDet.JobNo
            LEFT JOIN JobReq ON POReleases.JobNo = JobReq.JobNo AND PODet.PartNo = JobReq.PartNo
            LEFT JOIN Materials m ON m.PartNo = OrderDet.PartNo AND m.SubPartNo = PODet.PartNo

            WHERE PODet.GLCode = '5010-20'
            AND POReleases.PONum = '36862'
            AND m.Qty IS NOT NULL

            GROUP BY 
                POReleases.PONum, 
                POReleases.JobNo, 
                POReleases.Qty, 
                PODet.PartNo, 
                PODet.QtyOrd, 
                PODet.DueDate, 
                PODet.Status,
                PODet.ProdCode,
                PODet.GLCode,
                m.Qty;
    `,


        function(err, recordset) {
            if (err) console.error(err);
            let records = recordset.recordsets[0];

            res.send(records)
        })
    })
};

module.exports = {
    getAllJobs,
    getNextMonthJobs,
    getFutureJobs,
    getAllSubJobs,
    getSingleJob,
    updateJob,
    updateEmail,
    updateHold,
    Unconfirmed,
    Test,
    Test2,
}