const model = require('../models/engineering');

function getJobs(req, res) {
    model.getJobs(req, res);
}

exports.getJobs = getJobs;