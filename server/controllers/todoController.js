const Op = require('sequelize').Op;

const { Todo } = require('../models');

async function getAllTodos(req, res) {
    await Todo.findAll({
        where: {
            status: { [Op.ne]: 'Complete'}
        },
        order: [['priority', 'DESC']]
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

async function updateTodo(req, res) {
    let id = req.body.updateTodo.id;

    await Todo.update(
        req.body.updateTodo,
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

module.exports = {
    getAllTodos,
    createTodo,
    updateTodo,
}