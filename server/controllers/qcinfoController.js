const { QCInfo } = require('../models');
require("dotenv").config();

async function getAllQCNotes(req, res) {
    await Material.QCInfo({
        order: [
            ['custCode', 'ASC']
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

async function createQCNote(req, res) {
    await QCInfo.create(req.body)
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

async function updateQCInfo(req, res) {
    let id = req.body.id
    let custCode = req.body.custCode
    let notes = req.body.notes
    
    await QCInfo.update(
        {
            custCode, 
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
    getAllQCNotes,
    createQCNote,
    updateQCInfo,
}