import api from '../api';

const createRequest = async (newRequest) => {
    const res = await api.post('/shipping/createRequest', newRequest);
    return res.data;
}

export default createRequest;