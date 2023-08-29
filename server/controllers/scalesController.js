const { Scales } = require('../models');

async function getAllScales(req, res) {
    await Scales.findAll()
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

exports.getAllScales = getAllScales;