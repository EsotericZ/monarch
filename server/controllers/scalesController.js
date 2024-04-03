const { ScaleItems } = require('../models');
const { Scales } = require('../models');

async function getAllPorts(req, res) {
    await Scales.findAll({
        order: [
            ['rack', 'ASC'],
            ['portNo', 'ASC']
        ]
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

async function getMMItems(req, res) {
    console.log('hit')
    await ScaleItems.findAll()
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

async function createPort(req, res) {
    await Scales.create(req.body)
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
    getAllPorts,
    getMMItems,
    createPort,
}