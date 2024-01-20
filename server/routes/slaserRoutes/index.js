let express = require('express');
let router = express.Router();

const slaserController = require('../../controllers/slaserController');

router.get('/getAllJobs', slaserController.getAllJobs);
router.get('/getTBRJobs', slaserController.getTBRJobs);
router.get('/getFRJobs', slaserController.getFRJobs);

module.exports = router;