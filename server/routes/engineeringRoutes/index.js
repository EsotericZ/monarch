let express = require('express');
let router = express.Router();

const engineeringController = require('../../controllers/engineeringController');

router.get('/getAllJobs', engineeringController.getAllJobs);
router.get('/getTBRJobs', engineeringController.getTBRJobs);
router.get('/getFRJobs', engineeringController.getFRJobs);
router.get('/getRepeatJobs', engineeringController.getRepeatJobs);
router.get('/getPrints', engineeringController.getPrints);
router.post('/updateJob', engineeringController.updateJob);
router.post('/updateModel', engineeringController.updateModel);

module.exports = router;