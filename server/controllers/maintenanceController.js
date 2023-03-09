const { Maintenance } = require('../models');
let sequelize = require('../config/index');

function getAllRequests(req, res) {
    console.log('hit')
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