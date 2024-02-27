let express = require('express');
let router = express.Router();

const tapController = require('../../controllers/tapController');

router.get('/getStandardTaps', tapController.getStandardTaps);
router.get('/getMetricTaps', tapController.getMetricTaps);
router.post('/createTap', tapController.createTap);

module.exports = router;