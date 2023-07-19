import api from '../api';

const createTodo = async (newTodo) => {
    const res = await api.post('/todo/createTodo', newTodo);
    return res.data;
}

export default createTodo;