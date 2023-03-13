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

exports.getAllRequests = getAllRequests;
exports.createRequest = createRequest;
exports.updateRequest = updateRequest;