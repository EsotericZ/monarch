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
    let itemId = req.body.currentItemId
    let alert = req.body.itemAlert
    let rack = req.body.itemRack
    let shelf = req.body.itemShelf
    let bin = req.body.itemBin
    let area = req.body.itemArea
    let smallItem = req.body.itemSmall
    
    await ScaleItems.update(
        {
            itemName,
            itemLocation,
            alert,
            rack,
            shelf,
            bin,
            area,
            smallItem
        },
        { where: { itemId: itemId }}
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

async function deleteMMItem(req, res) {
    let itemId = req.body.itemId;

    await ScaleItems.destroy({
        where: { itemId: itemId }
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

module.exports = {
    getAllPorts,
    getMMItems,
    createPort,
    createMMItem,
    updateItem,
    deleteMMItem,
}