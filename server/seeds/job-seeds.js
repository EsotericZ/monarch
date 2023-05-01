const { Jobs } = require('../models');

let jobData = [];

for (let i = 146700; i < 160001; i++) {
    jobData.push({
        jobNo: i,
    })
}

const seedJobs = () => Jobs.bulkCreate(jobData);

module.exports = seedJobs;