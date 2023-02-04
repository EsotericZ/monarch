const { Jobs } = require('../models');

const jobData = [
    {
        jobNo: '144891'
    },
    {
        jobNo: '145131'
    },
    {
        jobNo: '145137'
    },
    {
        jobNo: '145138'
    },
    {
        jobNo: '145220'
    },
    {
        jobNo: '145224'
    },
    {
        jobNo: '145225'
    },
    {
        jobNo: '145226'
    },
    {
        jobNo: '145227'
    },
    {
        jobNo: '145234'
    },
    {
        jobNo: '145235'
    },
    {
        jobNo: '145236'
    },
    {
        jobNo: '145237'
    },
    {
        jobNo: '145245'
    },
    {
        jobNo: '145246'
    },
    {
        jobNo: '145251'
    },
    {
        jobNo: '145252'
    },
    {
        jobNo: '145253'
    },
    {
        jobNo: '145281'
    },
    {
        jobNo: '145282'
    },
    {
        jobNo: '145283'
    },
    {
        jobNo: '145284'
    },
    {
        jobNo: '145285'
    },
    {
        jobNo: '145287'
    },
    {
        jobNo: '145288'
    },
    {
        jobNo: '145289'
    },
    {
        jobNo: '145303'
    },
]

const seedJobs = () => Jobs.bulkCreate(jobData);

module.exports = seedJobs;