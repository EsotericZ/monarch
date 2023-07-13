const { Shipping } = require('../models');
let sql = require('mssql');
require("dotenv").config();

let config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: '10.0.1.130\\E2SQLSERVER',
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true,
    }
};

async function getAllOrders(req, res) {
    await Shipping.findAll({
        order: [
            ['priority', 'DESC'],
            ['date', 'ASC'],
            ['record', 'ASC']
        ]
    })
    .then((result) => {
        return res.status(200).send({
            data: result
        })
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function getAllCustomers(req, res) {
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();
        request.query("SELECT DISTINCT CustCode FROM CustCode WHERE Active='Y' ORDER BY CustCode", 
        function(err, recordset) {
            if (err) console.error(err);
            let customers = recordset.recordsets[0];
            res.send(customers);
        })
    })
}

async function getAllVendors(req, res) {
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();
        request.query("SELECT DISTINCT VendCode FROM Routing ORDER BY VendCode", 
        function(err, recordset) {
            if (err) console.error(err);
            let vendors = recordset.recordsets[0];
            res.send(vendors);
        })
    })
}

async function createRequest(req, res) {
    await Shipping.create(req.body)
    .then((result) => {
        return res.status(200).send({
            data: result
        })
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateRecord(req, res) {
    let record = req.body.record;
    let updateRecord = req.body.updateRecord;

    await Shipping.update(
        updateRecord,
        { where: { record: record }}
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

async function scheduleRequest(req, res) {
    let record = req.body.record;
    let driver = req.body.driver;
    if (driver == null) {
        driver = '';
    };
    let date = req.body.date;
    date += ' 11:00:00'

    await Shipping.update(
        {
            driver: driver,
            date: date,
            scheduled: 1,
        },
        { where: { record: record }}
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

async function deleteSchedule(req, res) {
    console.log(req.body)
    let id = req.body.id;
    console.log(id)

    await Shipping.update(
        {
            date: null,
            timeFinish: null,
            scheduled: 0,
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
}

async function completeRequest(req, res) {
    let record = req.body.record;
    
    await Shipping.update(
        {
            done: 1,
        },
        { where: { record: record }}
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

async function updateTimes(req, res) {
    let id = req.body.id;
    let startTime = req.body.start;
    let endTime = req.body.end;

    await Shipping.update(
        {
            date: startTime,
            timeFinish: endTime,
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
}

exports.getAllOrders = getAllOrders;
exports.getAllCustomers = getAllCustomers;
exports.getAllVendors = getAllVendors;
exports.createRequest = createRequest;
exports.updateRecord = updateRecord;
exports.scheduleRequest = scheduleRequest;
exports.deleteSchedule = deleteSchedule;
exports.completeRequest = completeRequest;
exports.updateTimes = updateTimes;