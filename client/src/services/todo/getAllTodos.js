import api from '../../api/api';

const getAllTodos = async () => {
    console.log('hit!')
    const res = await api.get('/todo/getAllTodos');
    return res.data;
};

export default getAllTodos;