const { Maintenance } = require('../models');

const maintenanceData = [
    {
        description: 'Test'
    }
];

const seedMaintenance = () => Maintenance.bulkCreate(maintenanceData);

module.exports = seedMaintenance;