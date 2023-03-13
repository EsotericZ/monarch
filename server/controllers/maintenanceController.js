const { Maintenance } = require('../models');
let sequelize = require('../config/index');

async function getAllRequests(req, res) {
    console.log('hit')
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
    console.log('hit')
    console.log(req.body)
    await Maintenance.create(req.body)
}

function updateRequest(req, res) {
    console.log('hit')
}

exports.getAllRequests = getAllRequests;
exports.createRequest = createRequest;
exports.updateRequest = updateRequest;