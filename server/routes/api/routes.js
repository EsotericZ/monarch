let express = require('express');
let router = express.Router();

const engineeringController = require('../../controllers/engineeringController');
const maintenanceController = require('../../controllers/maintenanceController');
const portalController = require('../../controllers/portalController');
const scalesController = require('../../controllers/scalesController');
const shippingController = require('../../controllers/shippingController');
const tlaserController = require('../../controllers/tlaserController'); 
const slaserController = require('../../controllers/slaserController'); 
const flaserController = require('../../controllers/flaserController'); 
const sawController = require('../../controllers/sawController'); 
const shearController = require('../../controllers/shearController'); 
const punchController = require('../../controllers/punchController');
const todoController = require('../../controllers/todoController');
const userController = require('../../controllers/userController');
const formingController = require('../../controllers/formingController');

router.get('/', function (req, res) {
    res.send('Welcome to the API');
});

router.post('/portal/login', portalController.login);

router.get('/engineering/getAllJobs', engineeringController.getAllJobs);
router.get('/engineering/getTBRJobs', engineeringController.getTBRJobs);
router.get('/engineering/getFRJobs', engineeringController.getFRJobs);
router.get('/engineering/getRepeatJobs', engineeringController.getRepeatJobs);
router.get('/engineering/getPrints', engineeringController.getPrints);
router.post('/engineering/updateJob', engineeringController.updateJob);
router.post('/engineering/updateModel', engineeringController.updateModel);

router.post('/forming/updateJob', formingController.updateJob);

router.get('/tlaser/getAllJobs', tlaserController.getAllJobs);
router.get('/tlaser/getTBRJobs', tlaserController.getTBRJobs);
router.get('/tlaser/getFRJobs', tlaserController.getFRJobs);

router.get('/slaser/getAllJobs', slaserController.getAllJobs);
router.get('/slaser/getTBRJobs', slaserController.getTBRJobs);
router.get('/slaser/getFRJobs', slaserController.getFRJobs);

router.get('/flaser/getAllJobs', flaserController.getAllJobs);
router.get('/flaser/getTBRJobs', flaserController.getTBRJobs);
router.get('/flaser/getFRJobs', flaserController.getFRJobs);

router.get('/shear/getAllJobs', shearController.getAllJobs);
router.get('/shear/getTBRJobs', shearController.getTBRJobs);
router.get('/shear/getFRJobs', shearController.getFRJobs);

router.get('/saw/getAllJobs', sawController.getAllJobs);
router.get('/saw/getTBRJobs', sawController.getTBRJobs);
router.get('/saw/getFRJobs', sawController.getFRJobs);

router.get('/punch/getAllJobs', punchController.getAllJobs);
router.get('/punch/getTBRJobs', punchController.getTBRJobs);
router.get('/punch/getFRJobs', punchController.getFRJobs);

router.get('/maintenance/getAllRequests', maintenanceController.getAllRequests);
router.get('/maintenance/getAllEquipment', maintenanceController.getAllEquipment);
router.post('/maintenance/createRequest', maintenanceController.createRequest);
router.post('/maintenance/updateRequest', maintenanceController.updateRequest);
router.post('/maintenance/approveRequest', maintenanceController.approveRequest);
router.post('/maintenance/denyRequest', maintenanceController.denyRequest);
router.post('/maintenance/deleteRequest', maintenanceController.deleteRequest);
router.post('/maintenance/holdRequest', maintenanceController.holdRequest);
router.post('/maintenance/doneRequest', maintenanceController.doneRequest);

router.get('/scales/getAllPorts', scalesController.getAllPorts);
router.post('/scales/createPort', scalesController.createPort);

router.get('/shipping/getAllOrders', shippingController.getAllOrders);
router.get('/shipping/getAllCustomers', shippingController.getAllCustomers);
router.get('/shipping/getAllVendors', shippingController.getAllVendors);
router.post('/shipping/createRequest', shippingController.createRequest);
router.post('/shipping/updateRecord', shippingController.updateRecord);
router.post('/shipping/scheduleRequest', shippingController.scheduleRequest);
router.post('/shipping/deleteSchedule', shippingController.deleteSchedule);
router.post('/shipping/completeRequest', shippingController.completeRequest);
router.post('/shipping/updateTimes', shippingController.updateTimes);

router.get('/todo/getAllTodos', todoController.getAllTodos);
router.post('/todo/createTodo', todoController.createTodo);
router.post('/todo/updateTodo', todoController.updateTodo);

router.get('/users/getAllUsers', userController.getAllUsers);
router.post('/users/getUserPassword', userController.getUserPassword);
router.post('/users/createUser', userController.createUser);
router.post('/users/deleteUser', userController.deleteUser);
router.post('/users/updateUser', userController.updateUser);
router.post('/users/updateEngineering', userController.updateEngineering);
router.post('/users/updateMaintenance', userController.updateMaintenance);
router.post('/users/updateShipping', userController.updateShipping);

module.exports = router;