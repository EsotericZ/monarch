const { Supplies } = require('../models');

async function getAllSupplies(req, res) {
    await Supplies.findAll({
        where: {
            completed: 0,
        },
        order: [
            ['createdAt', 'ASC']
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

async function createSupplies(req, res) {
    await Supplies.create(req.body)
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

async function updateSupplies(req, res) {
    let id = req.body.id
    let supplies = req.body.supplies
    let department = req.body.department
    let requestedBy = req.body.requestedBy
    let notes = req.body.notes
    let productLink = req.body.productLink
    let jobNo = req.body.jobNo
    
    await Supplies.update(
        {
            supplies, 
            department, 
            requestedBy, 
            notes, 
            productLink, 
            jobNo
        },
        { where: { id: id }}
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

async function updateSuppliesDate(req, res) {
    let id = req.body.id
    let expected = req.body.date
    console.log('hi')
    
    await Supplies.update(
        {
            expected
        },
        { where: { id: id }}
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

async function updateOnOrderSupplies(req, res) {
    let id = req.body.id

    await Supplies.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.onOrder) {
            return res.status(200).send({
                data: result
            })
        } else {
            Supplies.update(
                { 
                    needSupplies: 0,
                    onOrder: 1,
                    completed: 0,
                },
                { where: { id:id }}
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
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateRecieved(req, res) {
    let id = req.body.id

    await Supplies.findOne({
        where: {id: id}
    })
    .then((result) => {
        Supplies.update(
            { 
                needSupplies: 0,
                onOrder: 0,
                completed: 1,
            },
            { where: { id:id }}
        ).then((result) => {
            return res.status(200).send({
                data: result
            })
        }).catch((err) => {
            return res.status(500).send({
                status: err
            })
        })
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

module.exports = {
    getAllSupplies,
    createSupplies,
    updateSupplies,
    updateSuppliesDate,
    updateOnOrderSupplies,
    updateRecieved,
}