let express = require('express');
let router = express.Router();

const backlogController = require('../../controllers/backlogController');

router.get('/getAllJobs', backlogController.getAllJobs);
router.post('/getAllSubJobs', backlogController.getAllSubJobs);
router.post('/getSingleJob', backlogController.getSingleJob);
router.get('/getTest', backlogController.getTest);

module.exports = router;