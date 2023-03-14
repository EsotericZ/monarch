const { Maintenance } = require('../models');

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

    console.log('server here')
    console.log(record, approvedBy)

    await Maintenance.update(
        { approvedBy: approvedBy },
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

    console.log('server here')
    console.log(record, done, comments)

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

async function holdRequest(req, res) {
    let record = req.body.record;
    let hold = req.body.requestHold;

    console.log('server here')
    console.log(record, hold)

    await Maintenance.update(
        { hold: hold },
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
exports.createRequest = createRequest;
exports.updateRequest = updateRequest;
exports.approveRequest = approveRequest;
exports.denyRequest = denyRequest;
exports.holdRequest = holdRequest;