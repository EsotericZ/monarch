const Op = require('sequelize').Op;
const { ScaleItems, ScaleLogs } = require('../models');

async function addNewScaleLog(req, res) {
    console.log('NEW TRY')

    try {
        const existingLogs = await ScaleLogs.findAll({
            where: {
                timeStamp: req.body.timeStamp
            }
        });

        console.log(req.body.itemName)
        const smallItemCheck = await ScaleItems.findOne({
            where: {
                itemName: req.body.itemName
            }
        })

        if (!smallItemCheck) {
            console.log('Scale Item Not Found')
            return res.status(404).send({
                message: 'ScaleItem not found'
            });
        }

        const quantityDifference = Math.abs(req.body.oldQty - req.body.newQty);
        console.log(quantityDifference)

        if (smallItemCheck.smallItem) {
            if (quantityDifference <= 2) {
                console.log('This is a small item with minimal change and should not be logged.');
                return res.status(200).send({
                    message: 'Small item change is below the threshold and will not be logged.'
                });
            }
        }

        if (existingLogs.length > 0) {
            console.log('Log with the same timestamp already exists.');
            return res.status(409).send({
                message: 'Log with the same timestamp already exists.'
            });
        } else {
            // Proceed with log creation
            console.log('THIS SHOULD BE CREATED');
            console.log(req.body);
            const newLog = await ScaleLogs.create(req.body);
            return res.status(200).send({
                data: newLog
            });
        }

    } catch (err) {
        console.error('Error adding new scale log:', err);
        return res.status(500).send({
            status: 'error',
            message: err.message
        });
    }
};

module.exports = {
    addNewScaleLog,
}