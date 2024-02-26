const { Material } = require('../models');
require("dotenv").config();

async function getAllTLMaterials(req, res) {
    await Material.findAll({
        where: {
            area: 'tlaser',
            completed: 0,
        },
        order: [
            ['programNo', 'ASC']
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

async function getAllLaserMaterials(req, res) {
    await Material.findAll({
        where: {
            area: 'laser',
            completed: 0,
        },
        order: [
            ['programNo', 'ASC']
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

async function updateCheck(req, res) {
    let id = req.body.id

    await Material.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.checkMatl) {
            return res.status(200).send({
                data: result
            })
        } else {
            Material.update(
                { 
                    checkMatl: 1,
                    needMatl: 0,
                    onOrder: 0,
                    verified: 0,
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

async function updateComplete(req, res) {
    let id = req.body.id

    await Material.findOne({
        where: {id: id}
    })
    .then((result) => {
        Material.update(
            { completed: 1 },
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

async function updateNeed(req, res) {
    let id = req.body.id

    await Material.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.needMatl) {
            return res.status(200).send({
                data: result
            })
        } else {
            Material.update(
                { 
                    checkMatl: 0,
                    needMatl: 1,
                    onOrder: 0,
                    verified: 0,
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

async function updateOnOrder(req, res) {
    let id = req.body.id

    await Material.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.onOrder) {
            return res.status(200).send({
                data: result
            })
        } else {
            Material.update(
                { 
                    checkMatl: 0,
                    needMatl: 0,
                    onOrder: 1,
                    verified: 0,
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

async function updateVerified(req, res) {
    let id = req.body.id

    await Material.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.verified) {
            return res.status(200).send({
                data: result
            })
        } else {
            Material.update(
                { 
                    checkMatl: 0,
                    needMatl: 0,
                    onOrder: 0,
                    verified: 1,
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


module.exports = {
    getAllTLMaterials,
    getAllLaserMaterials,
    createMaterial,
    updateCheck,
    updateComplete,
    updateNeed,
    updateOnOrder,
    updateVerified,
}