let express = require('express');
let router = express.Router();

const scalesController = require('../../controllers/scalesController');

router.get('/getAllPorts', scalesController.getAllPorts);
router.post('/createPort', scalesController.createPort);

module.exports = router;