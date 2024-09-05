const Op = require('sequelize').Op;
const { ScaleLogs } = require('../models');

async function addNewScaleLog(req, res) {
    console.log('NEW TRY')

    try {
        const existingLogs = await ScaleLogs.findAll({
            where: {
                timeStamp: req.body.timeStamp
            }
        });

        if (existingLogs.length > 0) {
            console.log('Log with the same timestamp already exists.');
            return res.status(409).send({
                message: 'Log with the same timestamp already exists.'
            });
        } else {
            console.log('THIS SHOULD BE CREATED')
            console.log(req.body)
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