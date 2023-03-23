const { User } = require('../models');

async function getAllUsers(req, res) {
    await User.findAll()
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

exports.getAllUsers = getAllUsers;