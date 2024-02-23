const { Material } = require('../models');
let sql = require('mssql');
require("dotenv").config();

async function getAllRequests(req, res) {
    await Maintenance.findAll()
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

async function createMaterial(req, res) {
    console.log(req.body)
    // await Material.create(req.body)
    // .then((result) => {
    //     return res.status(200).send({
    //         data: result
    //     })
    // }).catch((err) => {
    //     return res.status(500).send({
    //         status: err
    //     })
    // })
}

async function updateRequest(req, res) {
    let record = req.body.record;
    let updateRequest = req.body.updateRequest;

    await Maintenance.update(
        updateRequest,
        { where: { record: record }}
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
    getAllRequests,
    createMaterial,
    updateRequest,
}