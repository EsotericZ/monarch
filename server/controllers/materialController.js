const { Material } = require('../models');
require("dotenv").config();

async function getAllTLMaterials(req, res) {
    await Material.findAll({
        where: {
            area: 'tlaser',
            completed: 0,
        }
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

async function createMaterial(req, res) {
    await Material.create(req.body)
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

// async function updateRequest(req, res) {
//     let record = req.body.record;
//     let updateRequest = req.body.updateRequest;

//     await Maintenance.update(
//         updateRequest,
//         { where: { record: record }}
//     ).then((result) => {
//         return res.status(200).send({
//             data: result
//         })
//     }).catch((err) => {
//         return res.status(500).send({
//             status: err
//         })
//     })
// }

module.exports = {
    getAllTLMaterials,
    createMaterial,
    // updateRequest,
}