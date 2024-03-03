const CryptoJS = require('crypto-js');
const jwt = require("jsonwebtoken");
const Op = require('sequelize').Op;

const { User } = require('../models');

async function getAllUsers(req, res) {
    await User.findAll({
        where: {
            name: { [Op.ne]: 'Admin' }
        },
        order: [['number', 'ASC']]
    })
    .then((result) => {
        return res.status(200).send({
            data: result
        })
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function getUserPassword(req, res) {
    let id = req.body.id;
    const userInfo = await User.findOne({
        where: { id: id }
    })
    const bytes = CryptoJS.AES.decrypt(
        userInfo.password,
        process.env.SECRET_KEY || '1234'
    );
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8)
    console.log(decryptedPassword)

    return res.status(200).send({
        data: decryptedPassword
    })
}

async function createUser(req, res) {
    let password = req.body.password;
    let encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY || '1234'
    ).toString();
    let userData = req.body;
    userData['password'] = encryptedPassword;

    await User.create(req.body)
    .then((result) => {
        return res.status(200).send({
            data: result
        })
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function deleteUser(req, res) {
    let username = req.body.username;

    await User.destroy({
        where: { username: username }
    })
    .then((result) => {
        return res.status(200).send({
            data: result
        })
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateUser(req, res) {
    let userData = req.body.updateUser;
    let { id, name, username, number, password } = req.body.updateUser;
    
    const userInfo = await User.findOne({ 
        where: { id: id },
    });
    let encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY || '1234'
    ).toString();
    userData['password'] = encryptedPassword;

    await User.update(
        userData,
        { where: { id: id }}
    ).then((result) => {
        return res.status(200).send({
            data: result
        })
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateEngineering(req, res) {
    let id = req.body.id;

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.engineering) {
            User.update(
                { engineering: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            User.update(
                { engineering: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateMaintenance(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.maintenance) {
            User.update(
                { maintenance: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            User.update(
                { maintenance: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateShipping(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.shipping) {
            User.update(
                { shipping: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            User.update(
                { shipping: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateTLaser(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.tlaser) {
            User.update(
                { tlaser: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            User.update(
                { tlaser: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateQuality(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.quality) {
            User.update(
                { quality: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            User.update(
                { quality: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateForming(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.forming) {
            User.update(
                { forming: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            User.update(
                { forming: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateMachining(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.machining) {
            User.update(
                { machining: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            User.update(
                { machining: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateLaser(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.laser) {
            User.update(
                { laser: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            User.update(
                { laser: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateSaw(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.saw) {
            User.update(
                { saw: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            User.update(
                { saw: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updatePunch(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.punch) {
            User.update(
                { punch: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            User.update(
                { punch: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

async function updateShear(req, res) {
    let id = req.body.id

    await User.findOne({
        where: {id: id}
    })
    .then((result) => {
        if (result.shear) {
            User.update(
                { shear: 0 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        } else {
            User.update(
                { shear: 1 },
                { where: { id:id }}
            ).then((result) => {
                return res.status(200).send({
                    data: result
                })
            }).catch((err) => {
                return res.status(500).send({
                    status: err
                })
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            status: err
        })
    })
}

module.exports = {
    getAllUsers,
    getUserPassword,
    createUser,
    deleteUser,
    updateUser,
    updateEngineering,
    updateMaintenance,
    updateShipping,
    updateTLaser,
    updateQuality,
    updateForming,
    updateMachining,
    updateLaser,
    updateSaw,
    updatePunch,
    updateShear,
}