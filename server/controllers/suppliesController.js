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

module.exports = {
    getAllSupplies,
    createSupplies,
}