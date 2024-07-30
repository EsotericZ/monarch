const CryptoJS = require('crypto-js');
const jwt = require("jsonwebtoken");

const User = require('../models/User');
require('dotenv').config();

async function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    const userInfo = await User.findOne({ 
        where: { username: username },
    });
    if (!userInfo) {
        return res.status(405).json({
            status: 'error',
            description: 'User Does Not Exist'
        });
    } else {
        const bytes = CryptoJS.AES.decrypt(
            userInfo.password,
            process.env.SECRET_KEY || '1234'
        );
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        if (decryptedPassword === password) {
            const accessToken = jwt.sign(
                {
                    name: userInfo.name,
                    username: userInfo.username,
                    number: userInfo.number,
                    role: userInfo.role,
                    maintenance: userInfo.maintenance,
                    shipping: userInfo.shipping,
                    engineering: userInfo.engineering,
                    tlaser: userInfo.tlaser,
                    quality: userInfo.quality,
                    forming: userInfo.forming,
                    machining: userInfo.machining,
                    laser: userInfo.laser,
                    saw: userInfo.saw,
                    punch: userInfo.punch,
                    shear: userInfo.shear,
                    purchasing: userInfo.purchasing,
                    backlog: userInfo.backlog,
                },
                process.env.JWT_SECRET_KEY || 'pass',
                { expiresIn: '1d' }
            );
            return res.status(200).json({
                status: 'success',
                accessToken: accessToken,
            });
        } else {
            return res.status(405).json({
                status: 'error',
                description: 'Failed to Login'
            });
        }
    }
}

module.exports = {
    login,
}