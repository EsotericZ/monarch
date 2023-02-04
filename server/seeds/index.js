const seedJobs = require('./job-seeds');

const sequelize = require('../config');

const seedAll = async () => {
    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');

    await seedJobs();
    console.log('\n----- JOBS SYNCED -----\n');

    process.exit(0);
};

seedAll();