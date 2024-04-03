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

async function createMMItem(req, res) {
    await ScaleItems.create(req.body)
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

async function updateItem(req, res) {
    let itemName = req.body.itemName
    let itemLocation = req.body.itemLocation
    let scaleId = req.body.currentScaleId
    let alert = req.body.itemAlert
    
    await ScaleItems.update(
        {
            itemName,
            itemLocation,
            alert,
        },
        { where: { scaleId: scaleId }}
    ).then((result) => {
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
    createMMItem,
    updateItem,
}