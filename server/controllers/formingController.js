const { Jobs } = require('../models');
let sequelize = require('../config/index');

function updateJob(req, res) {
    let jobNo = req.body.jobNo;
    let formProgrammer = req.body.formProgrammer;
    let formStatus = req.body.formStatus;
    let notes = req.body.notes;
    let jobStatus

    if (formStatus == 'DONE') {
        jobStatus = 'FINALIZE'
    } else {
        jobStatus = 'FORMING'
    }
    
    let sql = `UPDATE jobs SET formProgrammer='${formProgrammer}', formStatus='${formStatus}', jobStatus='${jobStatus}', notes='${notes}' WHERE jobNo='${jobNo}'`;
    sequelize.query(sql, function(err, result) {
        return res.status(200).json({
            status: 'success',
            response: result
        })
    })
};

function updateFormProgrammer(req, res) {
    let jobNo = req.body.jobNo;
    let formProgrammer = req.body.formProgrammer;
    let sql = `UPDATE jobs SET formProgrammer='${formProgrammer}' WHERE jobNo='${jobNo}'`;
    sequelize.query(sql, function(err, result) {
        return res.status(200).json({
            status: 'success',
            response: result
        })
    })
    res.send(formProgrammer)
};

function updateFormStatus(req, res) {
    console.log('hit')
    let jobNo = req.body.jobNo;
    let formStatus = req.body.formStatus;
    let jobStatus

    if (formStatus == 'DONE') {
        jobStatus = 'FINALIZE'
    } else {
        jobStatus = 'FORMING'
    }

    let sql = `UPDATE jobs SET formStatus='${formStatus}', jobStatus='${jobStatus}' WHERE jobNo='${jobNo}'`;
    sequelize.query(sql, function(err, result) {
        return res.status(200).json({
            status: 'success',
            response: result
        })
    })
    res.send(formStatus)
};

module.exports = {
    updateJob,
    updateFormProgrammer,
    updateFormStatus,
}