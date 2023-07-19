const Op = require('sequelize').Op;

const { Todo } = require('../models');

async function getAllTodos(req, res) {
    await Todo.findAll({
        order: [['priority', 'ASC']]
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

async function createTodo(req, res) {
    await Todo.create(req.body)
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

// async function deleteUser(req, res) {
//     let username = req.body.username;

//     await User.destroy({
//         where: { username: username }
//     })
//     .then((result) => {
//         return res.status(200).send({
//             data: result
//         })
//     }).catch((err) => {
//         return res.status(500).send({
//             status: err
//         })
//     })
// }

// async function updateUser(req, res) {
//     let userData = req.body.updateUser;
//     let { id, name, username, number, password } = req.body.updateUser;
    
//     const userInfo = await User.findOne({ 
//         where: { id: id },
//     });
//     console.log("!!!!!!!!!!!!!!!!!", userInfo)
//     let encryptedPassword = CryptoJS.AES.encrypt(
//         password,
//         process.env.SECRET_KEY || '1234'
//     ).toString();
//     userData['password'] = encryptedPassword;

//     await User.update(
//         userData,
//         { where: { id: id }}
//     ).then((result) => {
//         return res.status(200).send({
//             data: result
//         })
//     }).catch((err) => {
//         return res.status(500).send({
//             status: err
//         })
//     })
// }

// async function updateEngineering(req, res) {
//     let id = req.body.id;

//     await User.findOne({
//         where: {id: id}
//     })
//     .then((result) => {
//         if (result.engineering) {
//             User.update(
//                 { engineering: 0 },
//                 { where: { id:id }}
//             ).then((result) => {
//                 return res.status(200).send({
//                     data: result
//                 })
//             }).catch((err) => {
//                 return res.status(500).send({
//                     status: err
//                 })
//             })
//         } else {
//             User.update(
//                 { engineering: 1 },
//                 { where: { id:id }}
//             ).then((result) => {
//                 return res.status(200).send({
//                     data: result
//                 })
//             }).catch((err) => {
//                 return res.status(500).send({
//                     status: err
//                 })
//             })
//         }
//     }).catch((err) => {
//         return res.status(500).send({
//             status: err
//         })
//     })
// }

// async function updateMaintenance(req, res) {
//     let id = req.body.id

//     await User.findOne({
//         where: {id: id}
//     })
//     .then((result) => {
//         if (result.maintenance) {
//             User.update(
//                 { maintenance: 0 },
//                 { where: { id:id }}
//             ).then((result) => {
//                 return res.status(200).send({
//                     data: result
//                 })
//             }).catch((err) => {
//                 return res.status(500).send({
//                     status: err
//                 })
//             })
//         } else {
//             User.update(
//                 { maintenance: 1 },
//                 { where: { id:id }}
//             ).then((result) => {
//                 return res.status(200).send({
//                     data: result
//                 })
//             }).catch((err) => {
//                 return res.status(500).send({
//                     status: err
//                 })
//             })
//         }
//     }).catch((err) => {
//         return res.status(500).send({
//             status: err
//         })
//     })
// }

// async function updateShipping(req, res) {
//     let id = req.body.id

//     await User.findOne({
//         where: {id: id}
//     })
//     .then((result) => {
//         if (result.shipping) {
//             User.update(
//                 { shipping: 0 },
//                 { where: { id:id }}
//             ).then((result) => {
//                 return res.status(200).send({
//                     data: result
//                 })
//             }).catch((err) => {
//                 return res.status(500).send({
//                     status: err
//                 })
//             })
//         } else {
//             User.update(
//                 { shipping: 1 },
//                 { where: { id:id }}
//             ).then((result) => {
//                 return res.status(200).send({
//                     data: result
//                 })
//             }).catch((err) => {
//                 return res.status(500).send({
//                     status: err
//                 })
//             })
//         }
//     }).catch((err) => {
//         return res.status(500).send({
//             status: err
//         })
//     })
// }

exports.getAllTodos = getAllTodos;
exports.createTodo = createTodo;
// exports.deleteUser = deleteUser;
// exports.updateUser = updateUser;
// exports.updateEngineering = updateEngineering;
// exports.updateMaintenance = updateMaintenance;
// exports.updateShipping = updateShipping;