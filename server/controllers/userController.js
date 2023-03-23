const { User } = require('../models');

async function getAllUsers(req, res) {
    await User.findAll({
        order: [['number', 'ASC']]
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

async function updateEngineering(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.engineering) {
            User.update(
                { engineering: 0 },
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
        } else {
            User.update(
                { engineering: 1 },
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

async function updateMaintenance(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.maintenance) {
            User.update(
                { maintenance: 0 },
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
        } else {
            User.update(
                { maintenance: 1 },
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

async function updateShipping(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.shipping) {
            User.update(
                { shipping: 0 },
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
        } else {
            User.update(
                { shipping: 1 },
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

exports.getAllUsers = getAllUsers;
exports.updateEngineering = updateEngineering;
exports.updateMaintenance = updateMaintenance;
exports.updateShipping = updateShipping;