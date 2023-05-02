const { Shipping } = require('../models');

async function getAllOrders(req, res) {
    await Shipping.findAll()
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

exports.getAllOrders = getAllOrders;