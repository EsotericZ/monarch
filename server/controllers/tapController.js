const { Taps } = require('../models');
require("dotenv").config();

async function getStandardTaps(req, res) {
    await Taps.findAll({
        where: {
            active: 1,
            type: 'Standard',
        },
        order: [
            ['holeSize', 'ASC']
        ],
    })
    .then((result) => {
        console.log(result)
        return res.status(200).send({
            data: result
        })
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function getMetricTaps(req, res) {
    await Taps.findAll({
        where: {
            active: 1,
            type: 'Metric',
        },
        order: [
            ['holeSize', 'ASC']
        ],
    })
    .then((result) => {
        return res.status(200).send({
            data: result
        })
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function createTap(req, res) {
    await Taps.create(req.body)
    .then((result) => {
        return res.status(200).send({
            data: result
        })
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

module.exports = {
    getStandardTaps,
    getMetricTaps,
    createTap,
}