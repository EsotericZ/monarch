const { User } = require('../models');
const CryptoJS = require('crypto-js');

require('dotenv').config();

let encryptedPassword = CryptoJS.AES.encrypt(
    'password',
    process.env.SECRET_KEY || '1234'
).toString();

const userData = [
    {
        name: 'Admin',
        username: 'admin',
        email: 'admin@admin.com',
        number: 0,
        password: encryptedPassword,
        role: 'admin',
    },
    {
        name: 'CJ Sanders',
        username: 'cjs',
        email: 'cjs@monarchmetalmfg.com',
        number: 206,
        password: encryptedPassword,
        role: 'admin',
    },
    {
        name: 'Brent Whittaker',
        username: 'brentw',
        email: 'brentw@monarchmetalmfg.com',
        number: 12,
        password: encryptedPassword,
        role: 'admin',
    },
    {
        name: 'Jon Streeter',
        username: 'jons',
        email: 'jons@monarchmetalmfg.com',
        number: 218,
        password: encryptedPassword,
        role: 'employee',
    },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;