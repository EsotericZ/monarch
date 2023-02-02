const model = require('../models/engineering');

function getAllJobs(req, res) {
    model.getAllJobs(req, res);
}

exports.getAllJobs = getAllJobs;