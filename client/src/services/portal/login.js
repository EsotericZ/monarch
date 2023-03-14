import api from '../api';

const login = async (username, password) => {
    const res = await api.post('/portal/login', {
        username: username,
        password: password,
    });
    return res.data;
}

export default login;