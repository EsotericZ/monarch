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
        jobNo: '145681'
    },
    {
        jobNo: '145708'
    },
    {
        jobNo: '145709'
    },
    {
        jobNo: '145807'
    },
    {
        jobNo: '145808'
    },
    {
        jobNo: '145809'
    },
    {
        jobNo: '145810'
    },
    {
        jobNo: '145817'
    },
]

const seedJobs = () => Jobs.bulkCreate(jobData);

module.exports = seedJobs;