const CryptoJS = require('crypto-js');
const jwt = require("jsonwebtoken");

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

async function createUser(req, res) {
    let password = req.body.password;
    let encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY || '1234'
    ).toString();
    let userData = req.body;
    userData['password'] = encryptedPassword;

    await User.create(req.body)
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

async function deleteUser(req, res) {
    let username = req.body.username;

    await User.destroy({
        where: { username:username }
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
    let id = req.body.id;

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
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.updateEngineering = updateEngineering;
exports.updateMaintenance = updateMaintenance;
exports.updateShipping = updateShipping;