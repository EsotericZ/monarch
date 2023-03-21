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
        number: 0,
        password: encryptedPassword,
        role: 'admin',
        maintenance: true,
        shipping: true,
        engineering: true,
    },
    {
        name: 'CJ Sanders',
        username: 'cjs',
        number: 206,
        password: encryptedPassword,
        role: 'admin',
        maintenance: true,
        shipping: true,
        engineering: true,
    },
    {
        name: 'Brent Whittaker',
        username: 'brentw',
        number: 12,
        password: encryptedPassword,
        role: 'admin',
        maintenance: true,
        shipping: true,
        engineering: true,
    },
    {
        name: 'Brandon Whittaker',
        username: 'brandonw',
        number: 120,
        password: encryptedPassword,
        role: 'admin',
        maintenance: true,
        shipping: false,
        engineering: false,
    },
    {
        name: 'Jon Streeter',
        username: 'jons',
        number: 218,
        password: encryptedPassword,
        role: 'employee',
        maintenance: true,
        shipping: false,
        engineering: false,
    },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;