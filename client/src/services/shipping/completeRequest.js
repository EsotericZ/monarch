import api from '../../api/api';

const completeRequest = async (record) => {
    const res = await api.post('/shipping/completeRequest', record)
    return res.data;
}

export default completeRequest;