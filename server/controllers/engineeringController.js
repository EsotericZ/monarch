const { Jobs } = require('../models');
const model = require('../models/engineering');

async function getAllJobs(req, res) {
    const jobData = await Jobs.findAll();
    model.getAllJobs(req, res, jobData);
};

function updateJob(req, res) {
    console.log(req.body)
    model.updateJob(req, res);
};

exports.getAllJobs = getAllJobs;
exports.updateJob = updateJob;