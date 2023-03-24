import api from '../api';

const createUser = async (newUser) => {
    const res = await api.post('/users/createUser', newUser);
    return res.data;
}

export default createUser;