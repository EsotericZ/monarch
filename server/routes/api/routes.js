let express = require('express');
let router = express.Router();

const engineeringController = require('../../controllers/engineeringController');
const maintenanceController = require('../../controllers/maintenanceController');
const portalController = require('../../controllers/portalController');
const userController = require('../../controllers/userController');

router.get('/', function (req, res) {
    res.send('Welcome to the API');
});

router.post('/portal/login', portalController.login);

router.get('/engineering/getAllJobs', engineeringController.getAllJobs);
router.post('/engineering/updateJob', engineeringController.updateJob);

router.get('/maintenance/getAllRequests', maintenanceController.getAllRequests);
router.get('/maintenance/getAllEquipment', maintenanceController.getAllEquipment);
router.post('/maintenance/createRequest', maintenanceController.createRequest);
router.post('/maintenance/updateRequest', maintenanceController.updateRequest);
router.post('/maintenance/approveRequest', maintenanceController.approveRequest);
router.post('/maintenance/denyRequest', maintenanceController.denyRequest);
router.post('/maintenance/holdRequest', maintenanceController.holdRequest);
router.post('/maintenance/doneRequest', maintenanceController.doneRequest);

router.get('/users/getAllUsers', userController.getAllUsers);
router.post('/users/createUser', userController.createUser);
router.post('/users/updateEngineering', userController.updateEngineering);
router.post('/users/updateMaintenance', userController.updateMaintenance);
router.post('/users/updateShipping', userController.updateShipping);

module.exports = router;