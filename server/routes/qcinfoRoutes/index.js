let express = require('express');
let router = express.Router();

const qcinfoController = require('../../controllers/qcinfoController');

router.get('/getAllQCNotes', qcinfoController.getAllQCNotes);
router.get('/createQCNote', qcinfoController.createQCNote);
router.get('/updateQCInfo', qcinfoController.updateQCInfo);

module.exports = router;