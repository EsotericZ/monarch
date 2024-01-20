let express = require('express');
let router = express.Router();

const todoController = require('../../controllers/todoController');

router.get('/getAllTodos', todoController.getAllTodos);
router.post('/createTodo', todoController.createTodo);
router.post('/updateTodo', todoController.updateTodo);

module.exports = router;