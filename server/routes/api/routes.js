let express = require('express');
let router = express.Router();

const engineeringController = require('../../controllers/engineeringController');
const maintenanceController = require('../../controllers/maintenanceController');
const portalController = require('../../controllers/portalController');

router.get('/', function (req, res) {
    res.send('Welcome to the API');
});

router.post('/portal/login', portalController.login);

router.get('/engineering/getAllJobs', engineeringController.getAllJobs);
router.post('/engineering/updateJob', engineeringController.updateJob);

router.get('/maintenance/getAllRequests', maintenanceController.getAllRequests);
router.post('/maintenance/createRequest', maintenanceController.createRequest);
router.post('/maintenance/updateRequest', maintenanceController.updateRequest);

module.exports = router;