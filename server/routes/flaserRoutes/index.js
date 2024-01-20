let express = require('express');
let router = express.Router();

const flaserController = require('../../controllers/flaserController');

router.get('/getAllJobs', flaserController.getAllJobs);
router.get('/getTBRJobs', flaserController.getTBRJobs);
router.get('/getFRJobs', flaserController.getFRJobs);

module.exports = router;