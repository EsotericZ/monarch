const seedJobs = require('./job-seeds');
const seedMaintenance = require('./maintenance-seeds');
const seedUsers = require('./user-seeds');

const sequelize = require('../config');

const seedAll = async () => {
    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');

    await seedJobs();
    console.log('\n----- JOBS SEEDED -----\n');

    await seedMaintenance();
    console.log('\n----- MAINTENANCE SEEDED -----\n');

    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');

    process.exit(0);
};

seedAll();