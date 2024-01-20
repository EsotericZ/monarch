let express = require('express');
let router = express.Router();

const shippingController = require('../../controllers/shippingController');

router.get('/getAllOrders', shippingController.getAllOrders);
router.get('/getAllCustomers', shippingController.getAllCustomers);
router.get('/getAllVendors', shippingController.getAllVendors);
router.post('/createRequest', shippingController.createRequest);
router.post('/updateRecord', shippingController.updateRecord);
router.post('/scheduleRequest', shippingController.scheduleRequest);
router.post('/deleteSchedule', shippingController.deleteSchedule);
router.post('/completeRequest', shippingController.completeRequest);
router.post('/updateTimes', shippingController.updateTimes);

module.exports = router;