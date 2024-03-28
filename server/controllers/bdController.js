const { BDChart } = require('../models');
require("dotenv").config();

async function getRecords(req, res) {
    await BDChart.findAll({
        order: [
            ['subType', 'ASC'],
            ['thickness', 'ASC'],
            ['radius', 'ASC'],
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

async function createRecord(req, res) {
    await BDChart.create(req.body)
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

async function updateRecord(req, res) {
    let id = req.body.id
    let radius = req.body.radius
    let bd = req.body.bd
    let punch = req.body.punch
    let die = req.body.die
    let notes = req.body.notes
    
    await BDChart.update(
        {
            radius,
            bd,
            punch,
            die,
            notes,
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

module.exports = {
    getRecords,
    createRecord,
    updateRecord,
}