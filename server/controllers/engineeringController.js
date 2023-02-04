const { Jobs } = require('../models');
const model = require('../models/engineering');

async function getAllJobs(req, res) {
    const jobData = await Jobs.findAll();
    model.getAllJobs(req, res, jobData);
}

exports.getAllJobs = getAllJobs;