import api from '../../api/api';

const createRequest = async (newRequest) => {
    console.log(newRequest)
    const res = await api.post('/shipping/createRequest', newRequest);
    return res.data;
}

export default createRequest;