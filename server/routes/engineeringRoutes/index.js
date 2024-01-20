let express = require('express');
let router = express.Router();

const engineeringController = require('../../controllers/engineeringController');

router.get('/getAllJobs', engineeringController.getAllJobs);
router.get('/getTBRJobs', engineeringController.getTBRJobs);
router.get('/getFutureJobs', engineeringController.getFutureJobs);
router.get('/getRepeatJobs', engineeringController.getRepeatJobs);
router.get('/getNextStep', engineeringController.getNextStep);
router.get('/getOutsourceJobs', engineeringController.getOutsourceJobs);
router.get('/getPrints', engineeringController.getPrints);
router.post('/updateJob', engineeringController.updateJob);
router.post('/updateModel', engineeringController.updateModel);

module.exports = router;