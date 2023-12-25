import api from '../../api/api';

const createTodo = async (newTodo) => {
    const res = await api.post('/todo/createTodo', newTodo);
    return res.data;
}

export default createTodo;