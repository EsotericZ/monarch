const { Scales } = require('../models');

async function getAllPorts(req, res) {
    await Scales.findAll()
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
    let { portNo, rack } = req.body;
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

exports.getAllPorts = getAllPorts;
exports.createPort = createPort;