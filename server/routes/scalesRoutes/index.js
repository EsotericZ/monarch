let express = require('express');
let router = express.Router();

const scalesController = require('../../controllers/scalesController');

router.get('/getAllPorts', scalesController.getAllPorts);
router.get('/getMMItems', scalesController.getMMItems);
router.post('/createPort', scalesController.createPort);

module.exports = router;