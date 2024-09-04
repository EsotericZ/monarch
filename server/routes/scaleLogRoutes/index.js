let express = require('express');
let router = express.Router();

const scaleLogController = require('../../controllers/scaleLogController');

router.post('/addNewScaleLog', scaleLogController.addNewScaleLog);

module.exports = router;