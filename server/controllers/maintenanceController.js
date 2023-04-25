const { Maintenance } = require('../models');
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

async function getAllRequests(req, res) {
    await Maintenance.findAll()
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

async function getAllEquipment(req, res) {
    sql.connect(config, function(err,) {
        if (err) console.error(err);
        let request = new sql.Request();
        request.query("SELECT DISTINCT PartNo, Descrip FROM Estim WHERE ProdCode='EQUIP' ORDER BY PartNo", 
        function(err, recordset) {
            if (err) console.error(err);
            let equipment = recordset.recordsets[0];
            res.send(equipment);
        })
    })
}

async function createRequest(req, res) {
    await Maintenance.create(req.body)
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

async function updateRequest(req, res) {
    let record = req.body.record;
    let updateRequest = req.body.updateRequest;

    await Maintenance.update(
        updateRequest,
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

async function approveRequest(req, res) {
    let record = req.body.record;
    let approvedBy = req.body.approvedBy;
    let hold = req.body.requestHold;

    await Maintenance.update(
        { 
            approvedBy: approvedBy,
            hold: hold, 
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

async function denyRequest(req, res) {
    let record = req.body.record;
    let done = req.body.done;
    let comments = req.body.comments;

    await Maintenance.update(
        { 
            done: done,
            comments: comments 
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

async function deleteRequest(req, res) {
    let record = req.body.record;

    await Maintenance.destroy({ 
        where: { record: record }
    }).then((result) => {
        return res.status(200).send({
            data: result
        })
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function holdRequest(req, res) {
    let record = req.body.record;
    let hold = req.body.requestHold;
    let approvedBy = req.body.approvedBy;

    await Maintenance.update(
        { 
            hold: hold, 
            approvedBy: approvedBy,
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

async function doneRequest(req, res) {
    let record = req.body.record;
    let done = req.body.done;

    await Maintenance.update(
        { done: done },
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

exports.getAllRequests = getAllRequests;
exports.getAllEquipment = getAllEquipment;
exports.createRequest = createRequest;
exports.updateRequest = updateRequest;
exports.approveRequest = approveRequest;
exports.denyRequest = denyRequest;
exports.deleteRequest = deleteRequest;
exports.holdRequest = holdRequest;
exports.doneRequest = doneRequest;