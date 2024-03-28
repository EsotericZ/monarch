let express = require('express');
let router = express.Router();

const bdController = require('../../controllers/bdController');

router.get('/getRecords', bdController.getRecords);
router.post('/createRecord', bdController.createRecord);
router.post('/updateRecord', bdController.updateRecord);

module.exports = router;