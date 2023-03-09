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
        jobNo: '145837'
    },
    {
        jobNo: '145838'
    },
    {
        jobNo: '145839'
    },
    {
        jobNo: '145840'
    },
    {
        jobNo: '145842'
    },
    {
        jobNo: '145843'
    },
    {
        jobNo: '145844'
    },
    {
        jobNo: '145846'
    },
    {
        jobNo: '145847'
    },
    {
        jobNo: '145849'
    },
    {
        jobNo: '145850'
    },
    {
        jobNo: '145869'
    },
]

const seedJobs = () => Jobs.bulkCreate(jobData);

module.exports = seedJobs;