const { QCInfo } = require('../models');
require("dotenv").config();

async function getAllQCNotes(req, res) {
    await QCInfo.findAll({
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
    let coc = req.body.coc
    let matlCert = req.body.matlCert
    let platCert = req.body.platCert
    let addInfo = req.body.addInfo
    let notes = req.body.notes
    
    await QCInfo.update(
        {
            custCode,
            coc,
            matlCert,
            platCert,
            addInfo,
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