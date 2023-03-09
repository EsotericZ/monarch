const { Maintenance } = require('../models');
let sequelize = require('../config/index');

async function getAllRequests(req, res) {
    console.log('hit')
    const requestData = await Maintenance.findAll()
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

function createRequest(req, res) {
    console.log('hit')
}

function updateRequest(req, res) {
    console.log('hit')
}

exports.getAllRequests = getAllRequests;
exports.createRequest = createRequest;
exports.updateRequest = updateRequest;