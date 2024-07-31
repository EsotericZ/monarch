let express = require('express');
let router = express.Router();

const backlogController = require('../../controllers/backlogController');

router.get('/getAllJobs', backlogController.getAllJobs);
router.post('/getAllSubJobs', backlogController.getAllSubJobs);
router.post('/getSingleJob', backlogController.getSingleJob);
router.post('/updateJob', backlogController.updateJob);
router.post('/updateEmail', backlogController.updateEmail);
router.post('/updateHold', backlogController.updateHold);

module.exports = router;