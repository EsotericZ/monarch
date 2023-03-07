const { Jobs } = require('../models');

const jobData = [
    {
        jobNo: '145378'
    },
    {
        jobNo: '145385'
    },
    {
        jobNo: '145408'
    },
    {
        jobNo: '145823'
    },
    {
        jobNo: '145824'
    },
    {
        jobNo: '145825'
    },
    {
        jobNo: '145826'
    },
    {
        jobNo: '145827'
    },
    {
        jobNo: '145828'
    },
    {
        jobNo: '145829'
    },
    {
        jobNo: '145830'
    },
]

const seedJobs = () => Jobs.bulkCreate(jobData);

module.exports = seedJobs;