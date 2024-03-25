let express = require('express');
let router = express.Router();

const suppliesController = require('../../controllers/suppliesController');

router.get('/getAllSupplies', suppliesController.getAllSupplies);
router.post('/createSupplies', suppliesController.createSupplies);
router.post('/updateSupplies', suppliesController.updateSupplies);
router.post('/updateSuppliesDate', suppliesController.updateSuppliesDate);

module.exports = router;