let express = require('express');
let router = express.Router();

const laserController = require('../../controllers/laserController');

router.get('/getAllJobs', laserController.getAllJobs);
router.get('/getTBRJobs', laserController.getTBRJobs);
router.get('/getFRJobs', laserController.getFRJobs);

module.exports = router;