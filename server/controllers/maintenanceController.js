const { Maintenance } = require('../models');
let sequelize = require('../config/index');

function createRequest(req, res) {
    console.log('hit')
}

exports.createRequest = createRequest;