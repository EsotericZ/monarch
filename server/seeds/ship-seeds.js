const { Shipping } = require('../models');

const shipData = [
    {
        record: 1,
        customer: 'MMM',
        location: 'Monarch Metal',
        priority: 'low',
    }
];

const seedShip = () => Shipping.bulkCreate(shipData);

module.exports = seedShip;