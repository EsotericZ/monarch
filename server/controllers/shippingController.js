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

async function scheduleRequest(req, res) {
    let record = req.body.record;
    let driver = req.body.driver;
    let date = req.body.date;

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

exports.getAllOrders = getAllOrders;
exports.getAllCustomers = getAllCustomers;
exports.createRequest = createRequest;
exports.scheduleRequest = scheduleRequest;
exports.completeRequest = completeRequest;