let express = require('express');
let router = express.Router();

const materialController = require('../../controllers/materialController');

router.get('/getAllTLMaterials', materialController.getAllTLMaterials);
router.get('/getAllLaserMaterials', materialController.getAllLaserMaterials);
router.post('/createMaterial', materialController.createMaterial);
router.post('/updateCheck', materialController.updateCheck);
router.post('/updateComplete', materialController.updateComplete);
router.post('/updateNeed', materialController.updateNeed);
router.post('/updateOnOrder', materialController.updateOnOrder);
router.post('/updateVerified', materialController.updateVerified);

module.exports = router;