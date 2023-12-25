import api from '../../api/api';

const updateTodo = async (updateTodo) => {
    const res = await api.post('/todo/updateTodo', {
        updateTodo: updateTodo
    });
    return res.data;
}

export default updateTodo;