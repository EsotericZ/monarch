let express = require('express');
let router = express.Router();

const bdRoutes = require('./bdRoutes');
const engineeringRoutes = require('./engineeringRoutes');
const flaserRoutes = require('./flaserRoutes');
const formingRoutes = require('./formingRoutes');
const jobbossRoutes = require('./jobbossRoutes');
const laserRoutes = require('./laserRoutes');
const machiningRoutes = require('./machiningRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const materialRoutes = require('./materialRoutes');
const portalRoutes = require('./portalRoutes');
const punchRoutes = require('./punchRoutes');
const qualityRoutes = require('./qualityRoutes');
const sawRoutes = require('./sawRoutes');
const scalesRoutes = require('./scalesRoutes');
const shearRoutes = require('./shearRoutes');
const shippingRoutes = require('./shippingRoutes');
const slaserRoutes = require('./slaserRoutes');
const suppliesRoutes = require('./suppliesRoutes');
const tapRoutes = require('./tapRoutes');
const tlaserRoutes = require('./tlaserRoutes');
const todoRoutes = require('./todoRoutes');
const userRoutes = require('./userRoutes');
const vtigerRoutes = require('./vtigerRoutes');

router.get('/', function (req, res) {
    res.send('Welcome to the API');
});

router.use('/bd', bdRoutes);
router.use('/engineering', engineeringRoutes);
router.use('/flaser', flaserRoutes);
router.use('/forming', formingRoutes);
router.use('/jobboss', jobbossRoutes);
router.use('/laser', laserRoutes);
router.use('/machining', machiningRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/material', materialRoutes);
router.use('/portal', portalRoutes);
router.use('/punch', punchRoutes);
router.use('/quality', qualityRoutes);
router.use('/saw', sawRoutes);
router.use('/scales', scalesRoutes);
router.use('/shear', shearRoutes);
router.use('/shipping', shippingRoutes);
router.use('/slaser', slaserRoutes);
router.use('/supplies', suppliesRoutes);
router.use('/taps', tapRoutes);
router.use('/tlaser', tlaserRoutes);
router.use('/todo', todoRoutes);
router.use('/users', userRoutes);
router.use('/vtiger', vtigerRoutes);

module.exports = router;